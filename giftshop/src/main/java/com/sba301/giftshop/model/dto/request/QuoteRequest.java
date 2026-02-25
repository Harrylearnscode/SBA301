package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteRequest {
    private List<QuoteItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuoteItemRequest {
        private Long productId;     // ID sản phẩm thường (nếu có)
        private Long customGiftId;  // ID sản phẩm custom (nếu có)
        private Integer quantity;   // Số lượng dự kiến mua
    }
}