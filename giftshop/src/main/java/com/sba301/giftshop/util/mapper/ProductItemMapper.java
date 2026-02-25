package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.ProductItemReponse;
import com.sba301.giftshop.model.entity.ProductItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductItemMapper {
    ProductItemReponse toResponse(ProductItem productItem);
}