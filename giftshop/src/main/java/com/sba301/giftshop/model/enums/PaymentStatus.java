package com.sba301.giftshop.model.enums;

public enum PaymentStatus {
    UNPAID,     // Chưa thanh toán
    DEPOSIT,    // Đã đặt cọc (thanh toán 1 phần)
    PAID,       // Đã thanh toán đủ
    REFUNDED    // Đã hoàn tiền
}
