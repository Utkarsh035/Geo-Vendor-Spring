package com.geovendor.controller;

import com.geovendor.dto.ApiResponse;
import com.geovendor.entity.*;
import com.geovendor.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    @Autowired
    private AdminService adminService;

    // ---- Users ----

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = adminService.viewAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // ---- Vendors ----

    @GetMapping("/vendors")
    public ResponseEntity<ApiResponse<List<Vendor>>> getAllVendors() {
        List<Vendor> vendors = adminService.viewAllVendors();
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }

    // ---- Contacts ----

    @GetMapping("/contacts")
    public ResponseEntity<ApiResponse<List<Contact>>> getAllContacts() {
        List<Contact> contacts = adminService.viewAllContacts();
        return ResponseEntity.ok(ApiResponse.success(contacts));
    }

    @DeleteMapping("/contacts")
    public ResponseEntity<ApiResponse<Void>> deleteContacts(@RequestBody Map<String, List<String>> body) {
        List<String> ids = body.get("ids");
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("No contact IDs provided"));
        }
        adminService.deleteContacts(ids.toArray(new String[0]));
        return ResponseEntity.ok(ApiResponse.success("Contacts deleted successfully", null));
    }

    // ---- Feedback ----

    @GetMapping("/feedback")
    public ResponseEntity<ApiResponse<List<Feedback>>> getAllFeedback() {
        List<Feedback> feedbacks = adminService.viewAllFeedback();
        return ResponseEntity.ok(ApiResponse.success(feedbacks));
    }

    @GetMapping("/vendor-feedback")
    public ResponseEntity<ApiResponse<List<VendorFeedback>>> getAllVendorFeedback() {
        List<VendorFeedback> feedbacks = adminService.viewVendorFeedback();
        return ResponseEntity.ok(ApiResponse.success(feedbacks));
    }

    // ---- Statistics ----

    @GetMapping("/stats/ratings")
    public ResponseEntity<ApiResponse<HashMap<String, Integer>>> getRatingStats() {
        HashMap<String, Integer> ratings = adminService.countRating();
        return ResponseEntity.ok(ApiResponse.success(ratings));
    }

    @GetMapping("/stats/monthly-contacts")
    public ResponseEntity<ApiResponse<LinkedHashMap<String, Integer>>> getMonthlyContactStats() {
        LinkedHashMap<String, Integer> monthlyData = adminService.getMonthlyContactCounts();
        return ResponseEntity.ok(ApiResponse.success(monthlyData));
    }
}
