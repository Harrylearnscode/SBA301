package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.PolicyRequest;
import com.sba301.giftshop.model.dto.response.PolicyResponse;

import java.util.List;

public interface PolicyService {
    PolicyResponse createPolicy(PolicyRequest request);
    PolicyResponse updatePolicy(Long id, PolicyRequest request);
    List<PolicyResponse> getAllPolicies();
    PolicyResponse getPolicyById(Long id);
    void deletePolicy(Long id);

    // Trả về số % được giảm giá dựa trên số lượng mua. Trả về 0 nếu không đạt mốc nào.
    Integer getApplicableDiscount(Integer totalQuantity);
}