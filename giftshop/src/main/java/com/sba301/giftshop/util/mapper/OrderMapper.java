package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.OrderResponse;
import com.sba301.giftshop.model.entity.Order;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderDetailMapper.class})
public interface OrderMapper {
    OrderResponse toResponse(Order order);
    List<OrderResponse> toResponseList(List<Order> orders);
}