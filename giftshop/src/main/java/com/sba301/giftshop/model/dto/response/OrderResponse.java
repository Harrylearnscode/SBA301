package com.sba301.giftshop.model.dto.response;

import com.sba301.giftshop.model.enums.OrderStatus;
import com.sba301.giftshop.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private OrderStatus status;
    private String shippingAddress;
    private String shipperPhoneNumber;
    private BigDecimal totalPrice;
    private Integer totalItem;
    private LocalDateTime orderDate;
    private LocalDateTime updateDate;
    private Integer discountApplied;
    private PaymentStatus payment;
    private List<OrderDetailReponse> orderDetails;
}
