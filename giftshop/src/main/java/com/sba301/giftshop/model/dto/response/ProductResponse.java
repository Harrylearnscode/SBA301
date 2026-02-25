package com.sba301.giftshop.model.dto.response;

import com.sba301.giftshop.model.entity.User;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;

    private CategoryResponse category;

    private String name;
    private String sku;

    private BigDecimal basePrice;

    private String description;

    private String imageUrl;

    private Boolean isGift;

    private Boolean isActive;

    private UserResponse createdBy;

    private List<ProductItemReponse> giftComponents;
}