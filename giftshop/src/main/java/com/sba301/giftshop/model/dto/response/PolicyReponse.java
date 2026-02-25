package com.sba301.giftshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyReponse {
    private Long id;
    private Integer upperLimit;
    private Integer lowerLimit;
    private Integer discount;
}
