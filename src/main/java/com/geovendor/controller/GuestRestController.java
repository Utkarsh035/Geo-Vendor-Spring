package com.geovendor.controller;

import com.geovendor.dto.ApiResponse;
import com.geovendor.dto.ContactRequest;
import com.geovendor.entity.Contact;
import com.geovendor.entity.User;
import com.geovendor.entity.Vendor;
import com.geovendor.service.GuestService;
import com.geovendor.service.UserService;
import com.geovendor.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GuestRestController {

    @Autowired
    private GuestService guestService;

    @Autowired
    private UserService userService;

    @Autowired
    private VendorService vendorService;

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<Map<String, Object>>> homePageData() {
        List<User> userFeedbacks = userService.allFeedbacks();
        List<Vendor> vendorFeedbacks = vendorService.allFeedback();

        Map<String, Object> data = new HashMap<>();
        data.put("userFeedbacks", userFeedbacks);
        data.put("vendorFeedbacks", vendorFeedbacks);

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Void>> submitContact(@Valid @RequestBody ContactRequest request) {
        java.sql.Date sqlDate = new java.sql.Date(new java.util.Date().getTime());
        Contact c = new Contact(request.getName(), request.getEmail(), request.getPhone(), request.getQuery(), sqlDate);
        int status = guestService.addContact(c);
        if (status > 0) {
            return ResponseEntity.ok(ApiResponse.success("Thank you for contacting us", null));
        }
        return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to submit contact form"));
    }
}
