package com.geovendor.dto;

import jakarta.validation.constraints.NotBlank;

public class BusinessRequest {

    @NotBlank(message = "Business name is required")
    private String name;

    @NotBlank(message = "Business category is required")
    private String category;

    private String description;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    private String gst;

    public BusinessRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGst() { return gst; }
    public void setGst(String gst) { this.gst = gst; }
}
