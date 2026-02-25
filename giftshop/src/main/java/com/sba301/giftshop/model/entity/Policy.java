package com.sba301.giftshop.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "POLICIES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "upper_limit")
    private Integer upperLimit;

    @Column(name = "lower_limit")
    private Integer lowerLimit;

    private Integer discount;
}
