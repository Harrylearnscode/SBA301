package com.sba301.giftshop.repository;

import com.sba301.giftshop.model.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findByUserIdOrderByCreatedAtDesc(Long userId);
}
