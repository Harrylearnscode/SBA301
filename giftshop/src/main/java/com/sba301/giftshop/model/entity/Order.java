package com.sba301.giftshop.model.entity;

import com.sba301.giftshop.model.enums.OrderStatus;
import com.sba301.giftshop.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

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

    // Giả sử shipping_address trong diagram lưu text, nếu lưu ID thì cần quan hệ
    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "shipper_phone_number")
    private String shipperPhoneNumber;

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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;
}