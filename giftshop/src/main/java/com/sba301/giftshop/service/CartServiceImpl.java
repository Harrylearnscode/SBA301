package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.response.CartResponse;
import com.sba301.giftshop.model.entity.Cart;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.CartRepository;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.repository.CartItemRepository;
import com.sba301.giftshop.util.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;
    private final ItemService itemService;

    @Override
    public Cart getCartEntityByUserId(Long userId) {
        // Lấy giỏ hàng của user, nếu chưa có thì tạo mới một giỏ hàng rỗng
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            Cart newCart = Cart.builder()
                    .user(user)
                    .cartItems(new ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });
    }

    @Override
    public CartResponse getCartByUserId(Long userId) {
        Cart cart = getCartEntityByUserId(userId);
        CartResponse res = cartMapper.toCartResponse(cart);
        
        if (res.getCartItems() != null) {
            for (com.sba301.giftshop.model.dto.response.CartItemResponse item : res.getCartItems()) {
                if (item.getProduct() != null) {
                    BigDecimal fefoPrice = itemService.calculateFefoPrice(item.getProduct().getId(), item.getProduct().getBasePrice());
                    item.getProduct().setBasePrice(fefoPrice);
                }
            }
        }
        return res;
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartEntityByUserId(userId);

        if (!cart.getCartItems().isEmpty()) {
            cartItemRepository.deleteAll(cart.getCartItems());
            cart.getCartItems().clear();
            cartRepository.save(cart);
        }
    }
}