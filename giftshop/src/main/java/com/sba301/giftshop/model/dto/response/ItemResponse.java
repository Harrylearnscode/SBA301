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
public class ItemResponse {
    private Long id;
    private Long productId; // thêm productId để trả về
    private LocalDate expiredDate;
    private String batchCode;
    private Integer initialQuantity;
    private Integer currentQuantity;
}
