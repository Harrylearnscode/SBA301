package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.AddToCartRequest;
import com.sba301.giftshop.model.dto.request.UpdateCartItemRequest;
import com.sba301.giftshop.model.dto.response.CartResponse;

public interface CartItemService {
    CartResponse addToCart(Long userId, AddToCartRequest request);
    CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request);
    CartResponse removeCartItem(Long userId, Long cartItemId);
}