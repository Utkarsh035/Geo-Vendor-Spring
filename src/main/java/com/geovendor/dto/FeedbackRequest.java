package com.geovendor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class FeedbackRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Rating is required")
    private String rating;

    private String remark;

    public FeedbackRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}
