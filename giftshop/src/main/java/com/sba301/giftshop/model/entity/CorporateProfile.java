package com.sba301.giftshop.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;

@Entity
@Table(name = "CORPORATE_PROFILES")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CorporateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Nationalized
    @Column(name = "company_name")
    private String companyName;

    @Nationalized
    @Column(name = "tax_id")
    private String taxId;

    @Nationalized
    @Column(name = "address_reg")
    private String addressReg;

    @Column(name = "credit_limit")
    private BigDecimal creditLimit;

    @Column(name = "current_debt")
    private BigDecimal currentDebt;

    @Column(name = "logo_url")
    private String logoUrl;
}
