package com.geovendor.controller;

import com.geovendor.dto.*;
import com.geovendor.entity.Business;
import com.geovendor.entity.Vendor;
import com.geovendor.entity.VendorFeedback;
import com.geovendor.exception.ResourceNotFoundException;
import com.geovendor.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
public class VendorRestController {

    @Autowired
    private VendorService vendorService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    // ---- Registration ----

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> register(
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String city,
            @RequestParam String address,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic) throws IOException {

        String dbPath = saveFile(profilePic, "vendorImages");

        Vendor v = new Vendor(email, name, password, phone, city, address, dbPath);
        vendorService.registerVendor(v);

        return ResponseEntity.ok(ApiResponse.success("Vendor registered successfully", null));
    }

    // ---- Profile ----

    @GetMapping("/{email}/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@PathVariable String email) {
        Vendor vendor = vendorService.getVendorProfile(email);
        if (vendor == null) {
            throw new ResourceNotFoundException("Vendor", "email", email);
        }
        Business business = vendorService.getBusinessProfile(email);

        Map<String, Object> data = new HashMap<>();
        data.put("vendor", vendor);
        data.put("business", business);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PutMapping("/{email}/profile")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @PathVariable String email,
            @Valid @RequestBody UpdateProfileRequest request) {

        Vendor v = new Vendor();
        v.setName(request.getName());
        v.setPhone(request.getPhone());
        v.setCity(request.getCity());
        v.setAddress(request.getAddress());

        int status = vendorService.editProfile(v, email);
        if (status == 0) {
            throw new ResourceNotFoundException("Vendor", "email", email);
        }
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", null));
    }

    // ---- Business ----

    @PostMapping(value = "/{email}/business", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> addBusiness(
            @PathVariable String email,
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam(required = false) String description,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam(required = false) String gst,
            @RequestParam(value = "businessPhoto", required = false) MultipartFile businessPhoto) throws IOException {

        String dbPath = saveFile(businessPhoto, "vendorImages");

        Business bs = new Business(email, category, name, description, phone, address, gst);
        bs.setBusinessPhoto(dbPath);

        vendorService.addBusiness(email, bs);
        return ResponseEntity.ok(ApiResponse.success("Business added successfully", null));
    }

    @PutMapping("/{email}/business")
    public ResponseEntity<ApiResponse<Void>> editBusiness(
            @PathVariable String email,
            @Valid @RequestBody BusinessRequest request) {

        Business bs = new Business();
        bs.setBusinessName(request.getName());
        bs.setPhone(request.getPhone());
        bs.setGstNo(request.getGst());
        bs.setAddress(request.getAddress());

        int status = vendorService.editBusiness(bs, email);
        if (status == 0) {
            throw new ResourceNotFoundException("Business", "vendor email", email);
        }
        return ResponseEntity.ok(ApiResponse.success("Business updated successfully", null));
    }

    // ---- Location ----

    @PutMapping("/{email}/location")
    public ResponseEntity<ApiResponse<Void>> updateLocation(
            @PathVariable String email,
            @Valid @RequestBody LocationRequest request) {

        int status = vendorService.addLocation(request.getLat(), request.getLng(), email);
        if (status == 0) {
            throw new ResourceNotFoundException("Business", "vendor email", email);
        }
        return ResponseEntity.ok(ApiResponse.success("Location updated successfully", null));
    }

    @PutMapping("/{email}/status")
    public ResponseEntity<ApiResponse<Void>> updateStatus(
            @PathVariable String email,
            @RequestBody UpdateStatusRequest request) {

        int status = vendorService.updateBusinessStatus(email, request.getIsActive());
        if (status == 0) {
            throw new ResourceNotFoundException("Business", "vendor email", email);
        }
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", null));
    }

    // ---- Feedback ----

    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        java.sql.Date sqlDate = new java.sql.Date(new java.util.Date().getTime());
        VendorFeedback vf = new VendorFeedback(request.getName(), request.getEmail(), request.getRating(), request.getRemark(), sqlDate);
        int status = vendorService.addVendorFeedback(vf);
        if (status > 0) {
            return ResponseEntity.ok(ApiResponse.success("Thank you for the feedback", null));
        }
        return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to submit feedback"));
    }

    // ---- File Upload Helper ----

    private String saveFile(MultipartFile file, String folderName) throws IOException {
        if (file == null || file.isEmpty()) return "";

        String uploadPath = System.getProperty("user.dir") + File.separator + uploadDir + File.separator + folderName;
        File dir = new File(uploadPath);
        if (!dir.exists()) dir.mkdirs();

        String fileName = file.getOriginalFilename();
        String fullPath = uploadPath + File.separator + fileName;
        file.transferTo(new File(fullPath));

        return folderName + File.separator + fileName;
    }
}
