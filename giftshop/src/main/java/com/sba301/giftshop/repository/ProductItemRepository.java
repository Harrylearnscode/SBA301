package com.sba301.giftshop.repository;

import com.sba301.giftshop.model.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    void deleteByCustomGiftId(Long customGiftId);
    List<ProductItem> findByCustomGiftId(Long customGiftId);
}
