package com.sba301.giftshop.model.entity;

import com.sba301.giftshop.model.enums.OrderStatus;
import com.sba301.giftshop.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ORDERS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Nationalized
    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "total_item") // Diagram có cột total_price 2 lần? check lại diagram, tôi thấy total_proc? Chắc là total_price
    private Integer totalItem;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @Column(name = "discount_applied")
    private Integer discountApplied;

    @Enumerated(EnumType.STRING)
    private PaymentStatus payment;

    @Column(name = "pay_url", length = 2000)
    private String payUrl;

    @Column(name = "paid_time")
    private LocalDateTime paidTime;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;
}