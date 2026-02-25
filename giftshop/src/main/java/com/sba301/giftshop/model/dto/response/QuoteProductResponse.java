package com.sba301.giftshop.model.dto.response;

import com.sba301.giftshop.model.entity.Product;
import com.sba301.giftshop.model.entity.Quote;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteProductResponse {
    private Long id;

    private ProductResponse product;

    private ProductResponse customGift;

    private Integer quantity;

    private BigDecimal quotedPrice;
}
