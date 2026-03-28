package com.sba301.giftshop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

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

    @Nationalized
    private String name;

    private String sku;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Nationalized
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_gift")
    private Boolean isGift;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "logo_url")
    private String logoUrl;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Nếu sản phẩm là Gift, nó sẽ bao gồm nhiều product con
    @OneToMany(mappedBy = "customGift")
    @ToString.Exclude
    private List<ProductItem> giftComponents;
}