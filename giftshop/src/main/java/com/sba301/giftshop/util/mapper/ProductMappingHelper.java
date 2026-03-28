package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.ProductSummaryResponse;
import com.sba301.giftshop.model.entity.Product;

public class ProductMappingHelper {
    public static ProductSummaryResponse mapToSummary(Product product) {
        if (product == null) return null;
        return ProductSummaryResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .basePrice(product.getBasePrice())
                .imageUrl(product.getImageUrl())
                .build();
    }
}
