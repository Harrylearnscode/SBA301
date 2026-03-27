package com.sba301.giftshop.model.enums;

public enum OrderStatus {
    PENDING,      // Chờ xác nhận
    PROCESSING,   // Đang chuẩn bị hàng
    SHIPPED,      // Đang giao
    DELIVERED,    // Đã giao thành công
    CANCELLED;    // Đã hủy

    /**
     * Kiểm tra xem có thể chuyển từ trạng thái hiện tại sang trạng thái mới không.
     * Quy tắc: PENDING -> PROCESSING -> SHIPPED -> DELIVERED (1 chiều).
     * CANCELLED chỉ được phép từ PENDING hoặc PROCESSING.
     */
    public boolean canTransitionTo(OrderStatus newStatus) {
        if (this == newStatus) return false; // Không cho chuyển sang chính nó

        return switch (this) {
            case PENDING -> newStatus == PROCESSING || newStatus == CANCELLED;
            case PROCESSING -> newStatus == SHIPPED || newStatus == CANCELLED;
            case SHIPPED -> newStatus == DELIVERED;
            case DELIVERED, CANCELLED -> false; // Trạng thái cuối, không thể thay đổi
        };
    }
}
