package com.sba301.giftshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CorporateProfileResponse {
    private Long id;
    private String companyName;
    private String taxId;
    private String addressReg;
    private BigDecimal creditLimit;
    private BigDecimal currentDebt;
    private String logoUrl;
}
