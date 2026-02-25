package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.CartResponse;
import com.sba301.giftshop.model.dto.response.QuoteProductResponse;
import com.sba301.giftshop.model.entity.Cart;
import com.sba301.giftshop.model.entity.CartItem;
import com.sba301.giftshop.model.entity.QuoteProduct;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {
    public QuoteProductResponse toResponse(CartItem cartItem);
    public List<QuoteProductResponse> toCart(List<QuoteProduct> quoteProducts);
    public CartResponse toCartResponse(Cart cart);
}
