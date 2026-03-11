package com.sba301.giftshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemReponse {
    private Long id;

    // Sản phẩm thành phần bên trong
    private ProductResponse product;

    private Integer quantity;
}
