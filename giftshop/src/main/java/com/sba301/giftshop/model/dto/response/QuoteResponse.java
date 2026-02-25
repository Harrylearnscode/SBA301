package com.sba301.giftshop.model.dto.response;

import com.sba301.giftshop.model.entity.QuoteProduct;
import com.sba301.giftshop.model.entity.User;
import com.sba301.giftshop.model.enums.QuoteStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteResponse {
    private Long id;

    private UserResponse user;

    private UserResponse salesStaff;

    private QuoteStatus status;

    private BigDecimal totalPrice;

    private LocalDateTime validUntil;

    private LocalDateTime createdAt;

    private List<QuoteProductResponse> quoteProducts;
}
