package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.request.CheckoutRequest;
import com.sba301.giftshop.model.dto.request.UpdateOrderStatusRequest;
import com.sba301.giftshop.model.dto.request.UpdatePaymentStatusRequest;
import com.sba301.giftshop.model.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    // Dành cho Khách hàng
    OrderResponse checkout(Long userId, CheckoutRequest request);
    List<OrderResponse> getMyOrders(Long userId);
    OrderResponse getOrderById(Long orderId, Long userId);
    OrderResponse cancelOrder(Long orderId, Long userId);

    // Dành cho Admin
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
    OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request);
}
