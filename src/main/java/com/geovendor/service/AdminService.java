package com.geovendor.service;

import com.geovendor.entity.*;
import com.geovendor.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private VendorFeedbackRepository vendorFeedbackRepository;

    public boolean login(String email, String pass) {
        return "admin@gmail.com".equals(email) && "admin".equals(pass);
    }

    public List<Contact> viewAllContacts() {
        return contactRepository.findAll();
    }

    public List<User> viewAllUsers() {
        return userRepository.findAll();
    }

    public List<Vendor> viewAllVendors() {
        return vendorRepository.findAll();
    }

    public List<Feedback> viewAllFeedback() {
        return feedbackRepository.findAll();
    }

    public List<VendorFeedback> viewVendorFeedback() {
        return vendorFeedbackRepository.findAll();
    }

    @Transactional
    public int deleteContacts(String[] idArray) {
        try {
            for (String id : idArray) {
                contactRepository.deleteById(Integer.parseInt(id));
            }
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public HashMap<String, Integer> countRating() {
        HashMap<String, Integer> countMap = new HashMap<>();
        Object[] result = feedbackRepository.countRatings();
        if (result != null && result.length > 0) {
            Object[] row = (Object[]) result[0];
            countMap.put("five_star", ((Number) row[0]).intValue());
            countMap.put("four_star", ((Number) row[1]).intValue());
            countMap.put("three_star", ((Number) row[2]).intValue());
            countMap.put("two_star", ((Number) row[3]).intValue());
            countMap.put("one_star", ((Number) row[4]).intValue());
        }
        return countMap;
    }

    public LinkedHashMap<String, Integer> getMonthlyContactCounts() {
        LinkedHashMap<String, Integer> monthYearMap = new LinkedHashMap<>();
        List<Object[]> results = contactRepository.getMonthlyContactCounts();
        for (Object[] row : results) {
            monthYearMap.put((String) row[0], ((Number) row[1]).intValue());
        }
        return monthYearMap;
    }
}
