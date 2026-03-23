package com.geovendor.repository;

import com.geovendor.entity.VendorFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorFeedbackRepository extends JpaRepository<VendorFeedback, Integer> {

    @Query(value = "SELECT email FROM vendor_feedback WHERE email = ?1", nativeQuery = true)
    String findEmailByEmail(String email);

    @Query(value = "SELECT vf.name, vf.rating, vf.remark, v.profile_pic FROM vendor_feedback vf, vendor v "
            + "WHERE v.email = vf.email AND vf.rating = 'fas fa-star,fas fa-star,fas fa-star,fas fa-star,fas fa-star' "
            + "ORDER BY vf.date DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findTopFiveStarVendorFeedbacks();
}
