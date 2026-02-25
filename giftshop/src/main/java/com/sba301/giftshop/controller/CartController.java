package com.sba301.giftshop.controller;

import com.sba301.giftshop.model.dto.request.AddToCartRequest;
import com.sba301.giftshop.model.dto.request.UpdateCartItemRequest;
import com.sba301.giftshop.model.dto.response.ResponseObject;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.CartItemService;
import com.sba301.giftshop.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserRepository userRepository;

    // Hàm tiện ích để lấy ID của user đang đăng nhập từ JWT Token
    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("Người dùng chưa đăng nhập");
        }
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<ResponseObject> getCart() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Lấy thông tin giỏ hàng thành công")
                .data(cartService.getCartByUserId(userId))
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @PostMapping("/items")
    public ResponseEntity<ResponseObject> addToCart(@RequestBody AddToCartRequest request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Thêm vào giỏ hàng thành công")
                .data(cartItemService.addToCart(userId, request))
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ResponseObject> updateCartItem(
            @PathVariable Long itemId,
            @RequestBody UpdateCartItemRequest request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Cập nhật số lượng thành công")
                .data(cartItemService.updateCartItem(userId, itemId, request))
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ResponseObject> removeCartItem(@PathVariable Long itemId) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Xóa sản phẩm khỏi giỏ hàng thành công")
                .data(cartItemService.removeCartItem(userId, itemId))
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }

    @DeleteMapping
    public ResponseEntity<ResponseObject> clearCart() {
        Long userId = getCurrentUserId();
        cartService.clearCart(userId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("200")
                .message("Làm sạch giỏ hàng thành công")
                .isSuccess(true)
                .status(HttpStatus.OK)
                .build());
    }
}