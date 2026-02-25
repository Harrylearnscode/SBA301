package com.sba301.giftshop.model.enums;

public enum QuoteStatus {
    PENDING,      // Khách mới gửi yêu cầu
    PROCESSING,   // Sale đang tiếp nhận & tư vấn
    QUOTED,       // Sale đã cập nhật giá lên hệ thống
    ACCEPTED,     // Khách hàng đồng ý với giá
    REJECTED,     // Khách hàng từ chối
    CANCELLED     // Khách tự hủy yêu cầu
}
