package com.geovendor.repository;

import com.geovendor.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, String> {

    Vendor findByEmailAndPassword(String email, String password);
}
