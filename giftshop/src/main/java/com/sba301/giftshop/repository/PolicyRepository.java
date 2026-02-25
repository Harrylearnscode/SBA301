package com.sba301.giftshop.repository;

import com.sba301.giftshop.model.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    // Lấy tất cả chính sách, sắp xếp theo số lượng từ nhỏ đến lớn để Admin dễ nhìn
    List<Policy> findAllByOrderByLowerLimitAsc();

    // Tìm chính sách thỏa mãn điều kiện: lowerLimit <= quantity <= upperLimit
    @Query("SELECT p FROM Policy p WHERE :quantity >= p.lowerLimit AND :quantity <= p.upperLimit")
    Optional<Policy> findApplicablePolicy(@Param("quantity") Integer quantity);
}
