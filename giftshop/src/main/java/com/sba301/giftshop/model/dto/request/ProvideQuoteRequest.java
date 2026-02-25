package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProvideQuoteRequest {
    private LocalDateTime validUntil; // Hạn chót của báo giá này
    private List<QuoteItemPriceRequest> itemPrices;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuoteItemPriceRequest {
        private Long quoteProductId; // ID của QuoteProduct trong database
        private BigDecimal quotedPrice; // Giá Sale chốt cho khách (Đơn giá x Số lượng hoặc Giá đã giảm)
    }
}