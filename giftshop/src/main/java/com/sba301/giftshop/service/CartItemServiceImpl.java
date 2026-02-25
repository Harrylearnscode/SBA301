package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.AddToCartRequest;
import com.sba301.giftshop.model.dto.request.UpdateCartItemRequest;
import com.sba301.giftshop.model.dto.response.CartResponse;
import com.sba301.giftshop.model.entity.Cart;
import com.sba301.giftshop.model.entity.CartItem;
import com.sba301.giftshop.model.entity.Product;
import com.sba301.giftshop.repository.CartItemRepository;
import com.sba301.giftshop.repository.ProductRepository;
import com.sba301.giftshop.service.CartItemService;
import com.sba301.giftshop.service.CartService;
import com.sba301.giftshop.util.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final CartMapper cartMapper;

    @Override
    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {
        Cart cart = cartService.getCartEntityByUserId(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            // Đã có -> Cộng dồn số lượng
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            // Chưa có -> Thêm mới
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getCartItems().add(newItem);
            cartItemRepository.save(newItem);
        }
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

        // Kiểm tra bảo mật: Chỉ cho phép sửa giỏ hàng của chính mình
        if (!item.getCart().getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa giỏ hàng này");
        }

        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(item);
            item.getCart().getCartItems().remove(item);
        } else {
            item.setQuantity(request.getQuantity());
            cartItemRepository.save(item);
        }

        return cartMapper.toCartResponse(item.getCart());
    }

    @Override
    @Transactional
    public CartResponse removeCartItem(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ"));

        if (!item.getCart().getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa sản phẩm này");
        }

        Cart cart = item.getCart();
        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);

        return cartMapper.toCartResponse(cart);
    }
}