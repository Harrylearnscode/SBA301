package com.sba301.giftshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemResponse {
    private Long id;

    // Sản phẩm đóng vai trò là gói quà (Set)
//    private ProductResponse customGift;

    // Sản phẩm thành phần bên trong
    private ProductSummaryResponse product;

    private Integer quantity;
}
