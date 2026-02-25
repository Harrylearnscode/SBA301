package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.ProvideQuoteRequest;
import com.sba301.giftshop.model.dto.request.QuoteRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotes")
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService quoteService;
    private final UserRepository userRepository;

    // Lấy ID user từ Security Context
    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        if (user == null) throw new RuntimeException("Người dùng chưa đăng nhập");
        return user.getId();
    }

    // ==========================================
    // API DÀNH CHO KHÁCH HÀNG (CUSTOMER)
    // ==========================================

    @PostMapping
    public ResponseEntity<ResponseObject> createQuote(@RequestBody QuoteRequest request) {
        return new ResponseEntity<>(ResponseObject.builder()
                .code("201").message("Gửi yêu cầu báo giá thành công").isSuccess(true).status(HttpStatus.CREATED)
                .data(quoteService.createQuote(getCurrentUserId(), request))
                .build(), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseObject> getMyQuotes() {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(quoteService.getMyQuotes(getCurrentUserId()))
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getQuoteById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(quoteService.getQuoteById(id, getCurrentUserId()))
                .build());
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<ResponseObject> replyToQuote(@PathVariable Long id, @RequestParam boolean isAccepted) {
        String message = isAccepted ? "Bạn đã đồng ý với báo giá" : "Bạn đã từ chối báo giá";
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message(message).isSuccess(true).status(HttpStatus.OK)
                .data(quoteService.replyToQuote(id, getCurrentUserId(), isAccepted))
                .build());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ResponseObject> cancelQuote(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Đã hủy yêu cầu").isSuccess(true).status(HttpStatus.OK)
                .data(quoteService.cancelQuote(id, getCurrentUserId()))
                .build());
    }

    // ==========================================
    // API DÀNH CHO NHÂN VIÊN SALE / ADMIN
    // ==========================================

    @GetMapping("/admin")
    public ResponseEntity<ResponseObject> getAllQuotes() {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(quoteService.getAllQuotes())
                .build());
    }

    @PostMapping("/admin/{id}/assign")
    public ResponseEntity<ResponseObject> assignToMe(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Đã tiếp nhận yêu cầu báo giá").isSuccess(true).status(HttpStatus.OK)
                .data(quoteService.assignToMe(id, getCurrentUserId()))
                .build());
    }

    @PostMapping("/admin/{id}/provide-pricing")
    public ResponseEntity<ResponseObject> providePricing(@PathVariable Long id, @RequestBody ProvideQuoteRequest request) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Đã gửi báo giá cho khách hàng").isSuccess(true).status(HttpStatus.OK)
                .data(quoteService.providePricing(id, getCurrentUserId(), request))
                .build());
    }
}