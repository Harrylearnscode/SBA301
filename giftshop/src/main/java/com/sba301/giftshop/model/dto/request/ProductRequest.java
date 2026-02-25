package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private Long categoryId;
    private String name;
    private String sku;
    private BigDecimal basePrice;
    private String description;
    private String imageUrl;
    private Boolean isGift;
    private Boolean isActive;

    // Danh sách các sản phẩm thành phần. Chỉ truyền lên khi isGift = true
    private List<ProductItemRequest> giftComponents;
}