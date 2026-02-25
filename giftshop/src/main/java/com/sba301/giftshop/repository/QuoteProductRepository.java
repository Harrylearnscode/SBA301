package com.sba301.giftshop.repository;

import com.sba301.giftshop.model.entity.QuoteProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuoteProductRepository extends JpaRepository<QuoteProduct, Long> {
}
