package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.request.ProductItemRequest;
import com.sba301.giftshop.model.dto.response.ProductItemReponse;
import com.sba301.giftshop.model.entity.ProductItem;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductItemMapper {
    ProductItemReponse toResponse(ProductItem productItem);
    List<ProductItemReponse> toResponseList(List<ProductItem> productItems);

    ProductItem toEntity(ProductItemRequest productItemRequest);
    List<ProductItem> toEntityList(List<ProductItemRequest> productItems);
}