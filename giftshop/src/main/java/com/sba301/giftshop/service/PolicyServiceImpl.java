package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.PolicyRequest;
import com.sba301.giftshop.model.dto.response.PolicyReponse;
import com.sba301.giftshop.model.entity.Policy;
import com.sba301.giftshop.repository.PolicyRepository;
import com.sba301.giftshop.service.PolicyService;
import com.sba301.giftshop.util.mapper.PolicyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final PolicyMapper policyMapper;

    @Override
    @Transactional
    public PolicyReponse createPolicy(PolicyRequest request) {
        validatePolicyRange(request.getLowerLimit(), request.getUpperLimit(), null);

        Policy policy = Policy.builder()
                .lowerLimit(request.getLowerLimit())
                .upperLimit(request.getUpperLimit())
                .discount(request.getDiscount())
                .build();

        return policyMapper.toResponse(policyRepository.save(policy));
    }

    @Override
    @Transactional
    public PolicyReponse updatePolicy(Long id, PolicyRequest request) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chính sách giảm giá"));

        // Truyền ID hiện tại vào để bỏ qua chính nó khi kiểm tra trùng lặp
        validatePolicyRange(request.getLowerLimit(), request.getUpperLimit(), id);

        policy.setLowerLimit(request.getLowerLimit());
        policy.setUpperLimit(request.getUpperLimit());
        policy.setDiscount(request.getDiscount());

        return policyMapper.toResponse(policyRepository.save(policy));
    }

    @Override
    public List<PolicyReponse> getAllPolicies() {
        return policyMapper.toResponseList(policyRepository.findAllByOrderByLowerLimitAsc());
    }

    @Override
    public PolicyReponse getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chính sách giảm giá"));
        return policyMapper.toResponse(policy);
    }

    @Override
    @Transactional
    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy chính sách giảm giá");
        }
        policyRepository.deleteById(id);
    }

    @Override
    public Integer getApplicableDiscount(Integer totalQuantity) {
        if (totalQuantity == null || totalQuantity <= 0) return 0;

        Optional<Policy> applicablePolicy = policyRepository.findApplicablePolicy(totalQuantity);

        // Nếu tìm thấy chính sách phù hợp thì trả về % giảm, ngược lại trả về 0%
        return applicablePolicy.map(Policy::getDiscount).orElse(0);
    }

    // --- HÀM KIỂM TRA TÍNH HỢP LỆ VÀ TRÙNG LẶP ---
    private void validatePolicyRange(Integer newLower, Integer newUpper, Long currentPolicyId) {
        if (newLower == null || newUpper == null) {
            throw new RuntimeException("Vui lòng nhập đầy đủ mốc số lượng");
        }
        if (newLower >= newUpper) {
            throw new RuntimeException("Mốc số lượng tối thiểu phải nhỏ hơn tối đa");
        }

        List<Policy> existingPolicies = policyRepository.findAll();
        for (Policy p : existingPolicies) {
            // Bỏ qua chính sách đang cập nhật
            if (currentPolicyId != null && p.getId().equals(currentPolicyId)) continue;

            // Logic kiểm tra giao nhau (Overlap):
            // Hai khoảng [A, B] và [C, D] giao nhau nếu KHÔNG PHẢI (B < C hoặc A > D)
            boolean isOverlapping = !(newUpper < p.getLowerLimit() || newLower > p.getUpperLimit());

            if (isOverlapping) {
                throw new RuntimeException(
                        String.format("Khoảng số lượng [%d - %d] bị trùng lặp với chính sách ID %d [%d - %d]",
                                newLower, newUpper, p.getId(), p.getLowerLimit(), p.getUpperLimit())
                );
            }
        }
    }
}