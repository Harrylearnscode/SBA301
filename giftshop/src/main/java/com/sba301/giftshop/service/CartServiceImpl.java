package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.response.CartResponse;
import com.sba301.giftshop.model.entity.Cart;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.repository.CartRepository;
import com.sba301.giftshop.repository.UserRepository;
import com.sba301.giftshop.service.CartService;
import com.sba301.giftshop.util.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

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
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartEntityByUserId(userId);
        cart.getCartItems().clear(); // Nhờ CascadeType.ALL, xóa list này sẽ tự xóa dữ liệu trong bảng CART_ITEMS
        cartRepository.save(cart);
    }
}