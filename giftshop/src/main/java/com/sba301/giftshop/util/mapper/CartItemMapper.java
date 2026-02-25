package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.CartItemResponse;
import com.sba301.giftshop.model.entity.CartItem;
import org.mapstruct.Mapper;

@Mapper
public interface CartItemMapper {
    public CartItemResponse toCartItemResponse(CartItem cartItem);
}
