package com.geovendor.service;

import com.geovendor.entity.Business;
import com.geovendor.entity.Vendor;
import com.geovendor.entity.VendorFeedback;
import com.geovendor.repository.BusinessRepository;
import com.geovendor.repository.VendorFeedbackRepository;
import com.geovendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private VendorFeedbackRepository vendorFeedbackRepository;

    private static final TreeMap<String, String> ICON_MAP = new TreeMap<>();

    static {
        ICON_MAP.put("shop", "fas fa-store");
        ICON_MAP.put("school", "fas fa-school");
        ICON_MAP.put("hospital", "fas fa-hospital");
        ICON_MAP.put("hotel", "fas fa-hotel");
        ICON_MAP.put("restaurant", "fas fa-utensils");
        ICON_MAP.put("private_office", "fas fa-building");
        ICON_MAP.put("other", "fas fa-map-marker-alt");
    }

    public boolean checkLogin(String email, String password) {
        Vendor vendor = vendorRepository.findByEmailAndPassword(email, password);
        return vendor != null;
    }

    @Transactional
    public int registerVendor(Vendor vendor) {
        try {
            vendorRepository.save(vendor);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public Vendor getVendorProfile(String email) {
        return vendorRepository.findById(email).orElse(null);
    }

    @Transactional
    public int editProfile(Vendor updatedVendor, String email) {
        Vendor existing = vendorRepository.findById(email).orElse(null);
        if (existing == null) return 0;
        existing.setName(updatedVendor.getName());
        existing.setPhone(updatedVendor.getPhone());
        existing.setCity(updatedVendor.getCity());
        existing.setAddress(updatedVendor.getAddress());
        vendorRepository.save(existing);
        return 1;
    }

    @Transactional
    public int addBusiness(String email, Business bs) {
        try {
            bs.setEmail(email);
            bs.setBusinessIcon(ICON_MAP.get(bs.getBusinessCategory()));
            businessRepository.save(bs);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public Business getBusinessProfile(String email) {
        return businessRepository.findByEmail(email);
    }

    @Transactional
    public int editBusiness(Business bs, String email) {
        Business existing = businessRepository.findByEmail(email);
        if (existing == null) return 0;
        existing.setBusinessName(bs.getBusinessName());
        existing.setAddress(bs.getAddress());
        existing.setGstNo(bs.getGstNo());
        existing.setPhone(bs.getPhone());
        businessRepository.save(existing);
        return 1;
    }

    @Transactional
    public int addLocation(String lat, String lng, String email) {
        Business existing = businessRepository.findByEmail(email);
        if (existing == null) return 0;
        existing.setLocationLat(lat);
        existing.setLocationLong(lng);
        businessRepository.save(existing);
        return 1;
    }

    @Transactional
    public int updateLocation(String lat, String lng, String email) {
        return addLocation(lat, lng, email); // Same logic
    }

    @Transactional
    public int updateBusinessStatus(String email, Boolean isActive) {
        Business existing = businessRepository.findByEmail(email);
        if (existing == null) return 0;
        existing.setIsActive(isActive);
        businessRepository.save(existing);
        return 1;
    }

    @Transactional
    public int addVendorFeedback(VendorFeedback vf) {
        try {
            String existingEmail = vendorFeedbackRepository.findEmailByEmail(vf.getEmaill());
            if (existingEmail == null) {
                vendorFeedbackRepository.save(vf);
            } else {
                // Update existing — find by email then update
                // Since we can't easily do this with the current entity ID, use native approach
                VendorFeedback existing = vendorFeedbackRepository.findAll().stream()
                        .filter(f -> f.getEmaill().equals(vf.getEmaill()))
                        .findFirst().orElse(null);
                if (existing != null) {
                    existing.setRating(vf.getRating());
                    existing.setRemark(vf.getRemark());
                    existing.setDate(vf.getDate());
                    vendorFeedbackRepository.save(existing);
                }
            }
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * Returns top 5-star vendor feedbacks with profile pics.
     */
    public List<Vendor> allFeedback() {
        List<Object[]> results = vendorFeedbackRepository.findTopFiveStarVendorFeedbacks();
        List<Vendor> vendorList = new ArrayList<>();
        for (Object[] row : results) {
            VendorFeedback vfeed = new VendorFeedback();
            vfeed.setName((String) row[0]);
            vfeed.setRating((String) row[1]);
            vfeed.setRemark((String) row[2]);

            Vendor v = new Vendor();
            v.setProfilePic((String) row[3]);
            v.setVf(vfeed);
            vendorList.add(v);
        }
        return vendorList;
    }

    public String getIconForCategory(String category) {
        return ICON_MAP.getOrDefault(category, "fas fa-map-marker-alt");
    }
}
