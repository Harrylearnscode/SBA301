package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.PolicyRequest;
import com.sba301.giftshop.model.dto.response.PolicyReponse;

import java.util.List;

public interface PolicyService {
    PolicyReponse createPolicy(PolicyRequest request);
    PolicyReponse updatePolicy(Long id, PolicyRequest request);
    List<PolicyReponse> getAllPolicies();
    PolicyReponse getPolicyById(Long id);
    void deletePolicy(Long id);

    // Trả về số % được giảm giá dựa trên số lượng mua. Trả về 0 nếu không đạt mốc nào.
    Integer getApplicableDiscount(Integer totalQuantity);
}