package com.sba301.giftshop.repository;

import com.sba301.giftshop.model.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByProductId(Long productId);

    // Lấy các lô hàng chưa hết hạn và còn tồn kho
    @Query("SELECT i FROM Item i WHERE i.product.id = :productId AND i.expiredDate > :currentDate AND i.currentQuantity > 0 ORDER BY i.expiredDate ASC")
    List<Item> findAvailableItems(@Param("productId") Long productId, @Param("currentDate") LocalDate currentDate);
}
