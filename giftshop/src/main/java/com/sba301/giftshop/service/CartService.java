package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.response.CartResponse;
import com.sba301.giftshop.model.entity.Cart;

public interface CartService {
    // Dùng nội bộ trong Service
    Cart getCartEntityByUserId(Long userId);

    // API trả về cho người dùng
    CartResponse getCartByUserId(Long userId);
    void clearCart(Long userId);
}