package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequest {
    private Long productId;
    private LocalDate expiredDate;
    private String batchCode;
    private Integer initialQuantity;
    // Không cần currentQuantity vì khi mới nhập kho, currentQuantity = initialQuantity
}