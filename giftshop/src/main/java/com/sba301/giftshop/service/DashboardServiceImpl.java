package com.sba301.giftshop.service;

import com.sba301.giftshop.model.dto.response.DashboardResponse;
import com.sba301.giftshop.model.entity.Order;
import com.sba301.giftshop.model.entity.Quote;
import com.sba301.giftshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ItemRepository itemRepository;
    private final QuoteRepository quoteRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    public DashboardResponse getDashboardAnalytics() {
        // 1. Basic Stats
        long categories = categoryRepository.count();
        long products = productRepository.count();
        long items = itemRepository.count();
        long quotes = quoteRepository.count();
        long users = userRepository.count();
        List<Order> orders = orderRepository.findAll();
        
        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalPrice)
                .filter(price -> price != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        DashboardResponse.DashboardStats stats = DashboardResponse.DashboardStats.builder()
                .totalCategories(categories)
                .totalProducts(products)
                .totalItems(items)
                .totalQuotes(quotes)
                .totalUsers(users)
                .totalOrders(orders.size())
                .totalRevenue(totalRevenue)
                .build();

        // 2. Revenue Chart Data (Last 7 days)
        LocalDate today = LocalDate.now();
        Map<LocalDate, BigDecimal> revenueByDate = orders.stream()
                .filter(o -> o.getOrderDate() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().toLocalDate(),
                        Collectors.mapping(Order::getTotalPrice, Collectors.reducing(BigDecimal.ZERO, (a, b) -> b != null ? a.add(b) : a))
                ));

        List<DashboardResponse.RevenueChartPoint> chartData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            BigDecimal dayTotal = revenueByDate.getOrDefault(date, BigDecimal.ZERO);
            chartData.add(new DashboardResponse.RevenueChartPoint(date.format(formatter), dayTotal));
        }

        // 3. Recent Activity (Latest orders and quotes)
        List<DashboardResponse.RecentActivity> activities = new ArrayList<>();
        
        // Add orders to activity
        orders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .forEach(o -> activities.add(DashboardResponse.RecentActivity.builder()
                        .id("ORD-" + o.getId())
                        .type("ORDER")
                        .description("Đơn hàng mới từ " + (o.getUser() != null ? o.getUser().getFullName() : "Khách"))
                        .timestamp(o.getOrderDate() != null ? o.getOrderDate().format(DateTimeFormatter.ofPattern("dd/MM HH:mm")) : "N/A")
                        .status(o.getStatus() != null ? o.getStatus().name() : "PENDING")
                        .build()));

        // Add quotes to activity
        quoteRepository.findAll().stream()
                .sorted(Comparator.comparing(Quote::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .forEach(q -> activities.add(DashboardResponse.RecentActivity.builder()
                        .id("QUO-" + q.getId())
                        .type("QUOTE")
                        .description("Yêu cầu báo giá mới #" + q.getId() + (q.getUser() != null ? " từ " + q.getUser().getFullName() : ""))
                        .timestamp(q.getCreatedAt() != null ? q.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM HH:mm")) : "N/A")
                        .status(q.getStatus() != null ? q.getStatus().name() : "PENDING")
                        .build()));

        // Sort all activities by timestamp (implied by the order above, but let's just use the top 10 combined)
        List<DashboardResponse.RecentActivity> finalActivities = activities.stream()
                // Simple sort by timestamp string (desc) or we could have done it better with LocalDateTime
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(10)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .stats(stats)
                .revenueChart(chartData)
                .recentActivities(finalActivities)
                .build();
    }
}
