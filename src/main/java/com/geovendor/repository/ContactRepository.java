package com.geovendor.repository;

import com.geovendor.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {

    @Query(value = "SELECT date_format(date, '%Y-%m') AS ym, COUNT(*) AS contact_count FROM contact GROUP BY ym ORDER BY ym", nativeQuery = true)
    List<Object[]> getMonthlyContactCounts();
}
