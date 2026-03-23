package com.geovendor.controller;

import com.geovendor.dto.ApiResponse;
import com.geovendor.dto.LoginRequest;
import com.geovendor.service.AdminService;
import com.geovendor.service.UserService;
import com.geovendor.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    @Autowired
    private UserService userService;

    @Autowired
    private VendorService vendorService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/user/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> userLogin(@Valid @RequestBody LoginRequest request) {
        boolean status = userService.checkLogin(request.getEmail(), request.getPassword());
        if (status) {
            Map<String, String> data = new HashMap<>();
            data.put("email", request.getEmail());
            data.put("role", "user");
            return ResponseEntity.ok(ApiResponse.success("Login successful", data));
        }
        return ResponseEntity.status(401)
                .body(ApiResponse.error("Invalid credentials"));
    }

    @PostMapping("/vendor/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> vendorLogin(@Valid @RequestBody LoginRequest request) {
        boolean status = vendorService.checkLogin(request.getEmail(), request.getPassword());
        if (status) {
            Map<String, String> data = new HashMap<>();
            data.put("email", request.getEmail());
            data.put("role", "vendor");
            return ResponseEntity.ok(ApiResponse.success("Login successful", data));
        }
        return ResponseEntity.status(401)
                .body(ApiResponse.error("Invalid credentials"));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> adminLogin(@Valid @RequestBody LoginRequest request) {
        boolean status = adminService.login(request.getEmail(), request.getPassword());
        if (status) {
            Map<String, String> data = new HashMap<>();
            data.put("email", request.getEmail());
            data.put("role", "admin");
            return ResponseEntity.ok(ApiResponse.success("Login successful", data));
        }
        return ResponseEntity.status(401)
                .body(ApiResponse.error("Invalid credentials"));
    }
}
