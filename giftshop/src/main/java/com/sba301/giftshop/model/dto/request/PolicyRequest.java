package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyRequest {
    private Integer lowerLimit; // Số lượng tối thiểu để được giảm giá (VD: 20)
    private Integer upperLimit; // Số lượng tối đa cho mốc này (VD: 49)
    private Integer discount;   // Phần trăm giảm giá (VD: 30)
}