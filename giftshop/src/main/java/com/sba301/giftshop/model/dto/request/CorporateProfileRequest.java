package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorporateProfileRequest {
    private String companyName;
    private String taxId;
    private String addressReg;
    private BigDecimal creditLimit;
    private BigDecimal currentDebt;
    private String logoUrl;
}
