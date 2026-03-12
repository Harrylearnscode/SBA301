package com.sba301.giftshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSumaryResponse {
    private Long id;

    private CategoryResponse category;

    private String name;
    private String sku;

    private BigDecimal basePrice;

    private String description;

    private String imageUrl;

    private Boolean isGift;

    private Boolean isActive;
}
