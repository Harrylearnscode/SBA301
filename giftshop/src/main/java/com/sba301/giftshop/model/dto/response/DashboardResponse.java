package com.sba301.giftshop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private DashboardStats stats;
    private List<RevenueChartPoint> revenueChart;
    private List<RecentActivity> recentActivities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardStats {
        private long totalCategories;
        private long totalProducts;
        private long totalItems;
        private long totalQuotes;
        private long totalUsers;
        private long totalOrders;
        private BigDecimal totalRevenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueChartPoint {
        private String date;
        private BigDecimal total;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentActivity {
        private String id;
        private String type; // ORDER, QUOTE, PRODUCT
        private String description;
        private String timestamp;
        private String status;
    }
}
