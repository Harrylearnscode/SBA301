package com.sba301.giftshop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "PRODUCTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String name;
    private String sku;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_gift")
    private Boolean isGift;

    @Column(name = "is_active")
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Nếu sản phẩm là Gift, nó sẽ bao gồm nhiều product con
    @OneToMany(mappedBy = "customGift")
    @ToString.Exclude
    private List<ProductItem> giftComponents;
}