package com.sba301.giftshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemDetailResponse {
    private String productName;
    private Long id;
    private LocalDate expiredDate;
    private String batchCode;
    private Integer initialQuantity;
    private Integer currentQuantity;
}
