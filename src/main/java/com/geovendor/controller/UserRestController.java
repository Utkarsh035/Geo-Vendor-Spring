package com.geovendor.controller;

import com.geovendor.dto.*;
import com.geovendor.entity.Business;
import com.geovendor.entity.Feedback;
import com.geovendor.entity.User;
import com.geovendor.exception.ResourceNotFoundException;
import com.geovendor.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    @Autowired
    private UserService userService;

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

        if (userService.checkUserEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email already registered"));
        }

        String dbPath = saveFile(profilePic, "profileImages");

        java.sql.Date sqlDate = new java.sql.Date(new java.util.Date().getTime());
        User u = new User(email, password, name, phone, city, address, dbPath, sqlDate);
        userService.registerUser(u);

        return ResponseEntity.ok(ApiResponse.success("User registered successfully", null));
    }

    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkEmail(@RequestParam String email) {
        boolean exists = userService.checkUserEmail(email);
        return ResponseEntity.ok(ApiResponse.success(Map.of("exists", exists)));
    }

    // ---- Profile ----

    @GetMapping("/{email}/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(@PathVariable String email) {
        User user = userService.getUserProfile(email);
        if (user == null) {
            throw new ResourceNotFoundException("User", "email", email);
        }
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping(value = "/{email}/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @PathVariable String email,
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String city,
            @RequestParam String address,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic) throws IOException {

        String dbPath = saveFile(profilePic, "profileImages");

        User u = new User();
        u.setName(name);
        u.setPhone(phone);
        u.setCity(city);
        u.setAddress(address);
        if (!dbPath.isEmpty()) {
            u.setProfilePic(dbPath);
        }

        int status = userService.editProfile(u, email);
        if (status == 0) {
            throw new ResourceNotFoundException("User", "email", email);
        }
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", null));
    }

    // ---- Feedback ----

    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<Void>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        java.sql.Date sqlDate = new java.sql.Date(new java.util.Date().getTime());
        Feedback fd = new Feedback(request.getName(), request.getEmail(), request.getRating(), request.getRemark(), sqlDate);
        int status = userService.addFeedback(fd);
        if (status > 0) {
            return ResponseEntity.ok(ApiResponse.success("Thank you for the feedback", null));
        }
        return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to submit feedback"));
    }

    // ---- Map / Businesses ----

    @GetMapping("/businesses")
    public ResponseEntity<ApiResponse<List<Business>>> getAllBusinesses() {
        List<Business> businessList = userService.viewAllBusiness();
        return ResponseEntity.ok(ApiResponse.success(businessList));
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
