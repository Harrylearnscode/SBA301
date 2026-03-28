package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.PolicyResponse;
import com.sba301.giftshop.model.entity.Policy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PolicyMapper {
    // Chuyển đổi từ Entity sang Response DTO
    PolicyResponse toResponse(Policy policy);

    // Chuyển đổi danh sách
    List<PolicyResponse> toResponseList(List<Policy> policies);
}