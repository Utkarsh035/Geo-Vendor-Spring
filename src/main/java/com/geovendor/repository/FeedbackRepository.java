package com.geovendor.repository;

import com.geovendor.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    Feedback findByEmaill(String emaill);

    boolean existsByEmaill(String emaill);

    @Query(value = "SELECT COUNT(CASE WHEN rating = 'fas fa-star,fas fa-star,fas fa-star,fas fa-star,fas fa-star' THEN 1 END) AS five_star, "
            + "COUNT(CASE WHEN rating = 'fas fa-star,fas fa-star,fas fa-star,fas fa-star' THEN 1 END) AS four_star, "
            + "COUNT(CASE WHEN rating = 'fas fa-star,fas fa-star,fas fa-star' THEN 1 END) AS three_star, "
            + "COUNT(CASE WHEN rating = 'fas fa-star,fas fa-star' THEN 1 END) AS two_star, "
            + "COUNT(CASE WHEN rating = 'fas fa-star' THEN 1 END) AS one_star "
            + "FROM feedback", nativeQuery = true)
    Object[] countRatings();

    @Query(value = "SELECT f.name, f.rating, f.remark, u.profile_pic FROM feedback f, user u "
            + "WHERE u.email = f.emaill AND f.rating = 'fas fa-star,fas fa-star,fas fa-star,fas fa-star,fas fa-star' "
            + "ORDER BY f.date DESC LIMIT 5", nativeQuery = true)
    List<Object[]> findTopFiveStarFeedbacks();
}
