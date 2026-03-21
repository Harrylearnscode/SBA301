package com.sba301.giftshop.controller;

import java.util.Map;

import com.sba301.giftshop.model.dto.response.IpnResponse;
import com.sba301.giftshop.model.dto.response.PaymentResponse;
import com.sba301.giftshop.service.PaymentService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;
    
    @GetMapping("create-payment")
    public PaymentResponse createPayment(@RequestParam Long orderId) {
        return paymentService.createPayment(orderId);
    }

    @GetMapping("/vnpay_ipn")
    public IpnResponse processIpn(@RequestParam Map<String, String> params) {
        return paymentService.processIpn(params);
    }
}
