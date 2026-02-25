package com.sba301.giftshop.model.enums;

public enum OrderStatus {
    PENDING,      // Chờ xác nhận
    PROCESSING,   // Đang chuẩn bị hàng
    SHIPPED,      // Đang giao
    DELIVERED,    // Đã giao thành công
    CANCELLED     // Đã hủy
}
