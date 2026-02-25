package com.sba301.giftshop.util.mapper;

import com.sba301.giftshop.model.dto.response.OrderDetailReponse;
import com.sba301.giftshop.model.entity.OrderDetail;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderDetailMapper {
    OrderDetailReponse toResponse(OrderDetail orderDetail);
    List<OrderDetailReponse> toResponseList(List<OrderDetail> orderDetails);
}