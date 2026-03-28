package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.request.ProductItemRequest;
import com.sba301.giftshop.model.dto.response.ProductItemResponse;
import com.sba301.giftshop.model.entity.ProductItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", imports = {ProductMappingHelper.class})
public interface ProductItemMapper {
    @Mapping(target = "product", expression = "java(ProductMappingHelper.mapToSummary(productItem.getProduct()))")
    ProductItemResponse toResponse(ProductItem productItem);
    List<ProductItemResponse> toResponseList(List<ProductItem> productItems);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customGift", ignore = true)
    @Mapping(target = "product", ignore = true)
    ProductItem toEntity(ProductItemRequest productItemRequest);
    List<ProductItem> toEntityList(List<ProductItemRequest> productItems);
}