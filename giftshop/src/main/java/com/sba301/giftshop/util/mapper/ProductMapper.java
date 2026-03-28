package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.request.ProductRequest;
import com.sba301.giftshop.model.dto.response.ProductResponse;
import com.sba301.giftshop.model.dto.response.ProductSumaryResponse;
import com.sba301.giftshop.model.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

// Kết nối với UserMapper (đã tạo trước đó) và ProductItemMapper, CategoryMapper
@Mapper(componentModel = "spring", uses = {UserMapper.class, ProductItemMapper.class, CategoryMapper.class})
public interface ProductMapper {
    @Mapping(target = "expiredDate", ignore = true)
    ProductResponse toResponse(Product product);
    List<ProductResponse> toResponseList(List<Product> products);
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "expiredDate", ignore = true)
    ProductSumaryResponse toSummaryResponse(Product product);
    List<ProductSumaryResponse> toSummaryResponseList(List<Product> products);
    Product toEntity(ProductRequest productRequest);
}