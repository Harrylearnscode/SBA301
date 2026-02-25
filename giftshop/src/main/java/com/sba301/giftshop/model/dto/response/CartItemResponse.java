package com.sba301.giftshop.model.dto.response;

import com.sba301.giftshop.model.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private long id;
    private ProductResponse product;
    private Integer quantity;
}
