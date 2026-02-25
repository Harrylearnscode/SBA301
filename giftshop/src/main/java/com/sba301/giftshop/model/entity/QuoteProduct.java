package com.sba301.giftshop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "QUOTES_PRODUCTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quote_id")
    private Quote quote;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Trong diagram có custom_gift_id nối với PRODUCTS
    // Tùy logic, có thể gift cũng là product hoặc là trường riêng
    @ManyToOne
    @JoinColumn(name = "custom_gift_id")
    private Product customGift;

    private Integer quantity;

    @Column(name = "quoted_price")
    private BigDecimal quotedPrice;
}
