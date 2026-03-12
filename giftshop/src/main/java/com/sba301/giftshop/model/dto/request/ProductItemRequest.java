package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductItemRequest {
    private Long customGiftId; // ID của sản phẩm Gift cha
    private Long productId; // ID của sản phẩm thành phần
    private Integer quantity; // Số lượng của sản phẩm này trong giỏ quà
}