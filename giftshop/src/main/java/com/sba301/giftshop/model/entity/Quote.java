package com.sba301.giftshop.model.entity;

import com.sba301.giftshop.model.enums.QuoteStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "QUOTES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // Khách hàng
    private User user;

    @ManyToOne
    @JoinColumn(name = "sales_staff_id") // Nhân viên sale
    private User salesStaff;

    @Enumerated(EnumType.STRING)
    private QuoteStatus status;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "logo_url", length = 2000)
    private String logoUrl;

    @Nationalized
    @Column(name = "custom_note", length = 1000)
    private String customNote;

    @Column(name = "deposit_amount")
    private BigDecimal depositAmount;

    @OneToMany
    @JoinColumn(name = "quote_id")
    private java.util.List<QuoteProduct> quoteProducts;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;
}