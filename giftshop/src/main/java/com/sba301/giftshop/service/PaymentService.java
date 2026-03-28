package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.response.IpnResponse;
import com.sba301.giftshop.model.dto.response.PaymentResponse;

import java.util.Map;

public interface PaymentService {
	PaymentResponse createPayment(Long orderId, java.math.BigDecimal amount, String type);

	IpnResponse processIpn(Map<String, String> params);
}
