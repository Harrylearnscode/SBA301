package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.CheckoutRequest;
import com.sba301.giftshop.model.dto.request.UpdateOrderStatusRequest;
import com.sba301.giftshop.model.dto.request.UpdatePaymentStatusRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        if (user == null) throw new RuntimeException("Người dùng chưa đăng nhập");
        return user.getId();
    }

    // --- API CHO KHÁCH HÀNG ---

    @PostMapping("/checkout")
    public ResponseEntity<ResponseObject> checkout(@RequestBody CheckoutRequest request) {
        return new ResponseEntity<>(ResponseObject.builder()
                .code("201").message("Đặt hàng thành công").isSuccess(true).status(HttpStatus.CREATED)
                .data(orderService.checkout(getCurrentUserId(), request))
                .build(), HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ResponseObject> getMyOrders() {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(orderService.getMyOrders(getCurrentUserId()))
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(orderService.getOrderById(id, getCurrentUserId()))
                .build());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ResponseObject> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Hủy đơn hàng thành công").isSuccess(true).status(HttpStatus.OK)
                .data(orderService.cancelOrder(id, getCurrentUserId()))
                .build());
    }

    // --- API CHO ADMIN ---

    @GetMapping("/admin")
    public ResponseEntity<ResponseObject> getAllOrders() {
        // Có thể thêm @PreAuthorize("hasRole('ADMIN')") ở đây
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Thành công").isSuccess(true).status(HttpStatus.OK)
                .data(orderService.getAllOrders())
                .build());
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<ResponseObject> updateOrderStatus(@PathVariable Long id, @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Cập nhật trạng thái thành công").isSuccess(true).status(HttpStatus.OK)
                .data(orderService.updateOrderStatus(id, request))
                .build());
    }

    @PutMapping("/admin/{id}/payment")
    public ResponseEntity<ResponseObject> updatePaymentStatus(@PathVariable Long id, @RequestBody UpdatePaymentStatusRequest request) {
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200").message("Cập nhật thanh toán thành công").isSuccess(true).status(HttpStatus.OK)
                .data(orderService.updatePaymentStatus(id, request))
                .build());
    }
}