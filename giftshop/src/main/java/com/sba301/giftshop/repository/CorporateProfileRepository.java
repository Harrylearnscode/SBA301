package com.sba301.giftshop.repository;

import com.sba301.giftshop.model.entity.CorporateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CorporateProfileRepository extends JpaRepository<CorporateProfile, Long> {

}
