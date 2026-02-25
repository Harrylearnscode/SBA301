package com.sba301.giftshop.model.entity;

import com.sba301.giftshop.model.enums.QuoteStatus;
import jakarta.persistence.*;
import lombok.*;
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

    @OneToMany
    @JoinColumn(name = "quote_id")
    private java.util.List<QuoteProduct> quoteProducts;
}