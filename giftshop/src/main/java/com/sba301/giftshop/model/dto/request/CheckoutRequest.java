package com.sba301.giftshop.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private String shippingAddress;
    private String shipperPhoneNumber;
    // Có thể thêm paymentMethod ở đây nếu sau này bạn muốn tích hợp nhiều cổng thanh toán
}