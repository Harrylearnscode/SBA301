package com.sba301.giftshop.service;

import com.sba301.giftshop.configs.VnPayConfig;
import com.sba301.giftshop.model.dto.response.IpnResponse;
import com.sba301.giftshop.model.dto.response.PaymentResponse;
import com.sba301.giftshop.model.entity.Order;

import com.sba301.giftshop.model.enums.PaymentStatus;
import com.sba301.giftshop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

	private final OrderRepository orderRepository;

	@Override
	public PaymentResponse createPayment(Long orderId, java.math.BigDecimal amount, String type) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found"));

		java.math.BigDecimal finalAmount = (amount != null) ? amount : order.getTotalPrice();

		// txnRef mới: orderId_TYPE_timestamp (timestamp để chống trùng lặp khi thanh toán lại)
		String timestamp = new SimpleDateFormat("HHmmss").format(new java.util.Date());
		String txnRef = orderId + "_" + type + "_" + timestamp;

		long amountSats = finalAmount.multiply(java.math.BigDecimal.valueOf(100)).longValue();

		Map<String, String> vnpParams = new HashMap<>();
		vnpParams.put("vnp_Version", VnPayConfig.vnp_Version);
		vnpParams.put("vnp_Command", VnPayConfig.vnp_Command);
		vnpParams.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
		vnpParams.put("vnp_Amount", String.valueOf(amountSats));
		vnpParams.put("vnp_CurrCode", "VND");
		vnpParams.put("vnp_TxnRef", txnRef);
		vnpParams.put("vnp_OrderInfo", "Thanh toan don hang:" + txnRef);
		vnpParams.put("vnp_Locale", "vn");
		vnpParams.put("vnp_OrderType", "100000");
		vnpParams.put("vnp_IpAddr", "13.160.92.202");
		vnpParams.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);

		Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
		vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));

		cld.add(Calendar.MINUTE, 15);
		vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

		List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
		Collections.sort(fieldNames);

		StringBuilder hashData = new StringBuilder();
		StringBuilder query = new StringBuilder();
		for (int i = 0; i < fieldNames.size(); i++) {
			String fieldName = fieldNames.get(i);
			String fieldValue = vnpParams.get(fieldName);
			if (fieldValue != null && !fieldValue.isEmpty()) {
				hashData.append(fieldName)
						.append('=')
						.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

				query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
						.append('=')
						.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

				if (i < fieldNames.size() - 1) {
					query.append('&');
					hashData.append('&');
				}
			}
		}

		String vnpSecureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData.toString());
		String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + query + "&vnp_SecureHash=" + vnpSecureHash;

		return PaymentResponse.builder()
				.status("OK")
				.message("success")
				.paymentUrl(paymentUrl)
				.build();
	}

	@Override
	public IpnResponse processIpn(Map<String, String> params) {
		if (!verifyIpn(params)) {
			return IpnResponse.builder()
					.responseCode("97")
					.message("Signature failed")
					.build();
		}

		String txnRef = params.get("vnp_TxnRef");
		String vnpResponseCode = params.get("vnp_ResponseCode");

		if (!"00".equals(vnpResponseCode)) {
			log.info("[VNPay IPN FAIL] txnRef={} | vnpCode={}", txnRef, vnpResponseCode);
			return IpnResponse.builder()
					.responseCode("00")
					.message("Payment failed - no update")
					.build();
		}

		IpnResponse response;
		try {
			// Parse txnRef (orderId_TYPE_timestamp)
			String[] parts = txnRef.split("_");
			Long orderId = Long.parseLong(parts[0]);
			String type = parts.length > 1 ? parts[1] : "FULL";

			boolean updated = updatePaymentStatus(orderId, type);

			response = updated
					? IpnResponse.builder().responseCode("00").message("Successful").build()
					: IpnResponse.builder().responseCode("01").message("Order not found").build();
		} catch (Exception e) {
			response = IpnResponse.builder()
					.responseCode("99")
					.message("Unknown error")
					.build();
		}

		log.info("[VNPay IPN] txnRef={} | vnpCode={} | status={} | message={}",
				txnRef,
				vnpResponseCode,
				response.getResponseCode(),
				response.getMessage());

		return response;
	}

	private boolean updatePaymentStatus(Long orderId, String type) {
		return orderRepository.findById(orderId)
				.map(order -> {
					if ("DEPOSIT".equalsIgnoreCase(type)) {
						order.setPayment(PaymentStatus.DEPOSIT);
					} else {
						// Nếu là FULL hoặc REMAINING thì coi như đã trả đủ
						order.setPayment(PaymentStatus.PAID);
					}
					order.setPaidTime(LocalDateTime.now());
					orderRepository.save(order);
					return true;
				})
				.orElse(false);
	}

	private boolean verifyIpn(Map<String, String> params) {
		String reqSecureHash = params.get("vnp_SecureHash");

		Map<String, String> payloadParams = new HashMap<>(params);
		payloadParams.remove("vnp_SecureHash");
		payloadParams.remove("vnp_SecureHashType");

		List<String> fieldNames = new ArrayList<>(payloadParams.keySet());
		Collections.sort(fieldNames);

		StringBuilder hashPayload = new StringBuilder();
		for (int i = 0; i < fieldNames.size(); i++) {
			String fieldName = fieldNames.get(i);
			String fieldValue = payloadParams.get(fieldName);
			if (fieldValue != null && !fieldValue.isEmpty()) {
				hashPayload.append(fieldName)
						.append('=')
						.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
				if (i < fieldNames.size() - 1) {
					hashPayload.append('&');
				}
			}
		}

		String secureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashPayload.toString());
		return secureHash.equals(reqSecureHash);
	}
}
