package com.sba301.giftshop.model.dto.response;

import com.sba301.giftshop.model.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    private LocalDate expiredDate;
    private String batchCode;
    private Integer initialQuantity;
    private Integer currentQuantity;
}
