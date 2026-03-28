package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.OrderDetailResponse;
import com.sba301.giftshop.model.entity.OrderDetail;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderDetailMapper {
    OrderDetailResponse toResponse(OrderDetail orderDetail);
    List<OrderDetailResponse> toResponseList(List<OrderDetail> orderDetails);
}