package com.geovendor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "business")
public class Business {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "business_category")
    private String businessCategory;

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "description")
    private String description;

    @Column(name = "location_lat")
    private String locationLat;

    @Column(name = "location_long")
    private String locationLong;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "gst_no")
    private String gstNo;

    @Column(name = "business_photo")
    private String businessPhoto;

    @Column(name = "business_icon")
    private String businessIcon;

    public Business() {}

    public Business(String email, String businessCategory, String businessName,
                    String description, String locationLat, String locationLong,
                    String phone, String address, String gstNo, String businessPhoto) {
        this.email = email;
        this.businessCategory = businessCategory;
        this.businessName = businessName;
        this.description = description;
        this.locationLat = locationLat;
        this.locationLong = locationLong;
        this.phone = phone;
        this.address = address;
        this.gstNo = gstNo;
        this.businessPhoto = businessPhoto;
    }

    public Business(String email, String businessCategory, String businessName,
                    String description, String phone, String address, String gstNo) {
        this.email = email;
        this.businessCategory = businessCategory;
        this.businessName = businessName;
        this.description = description;
        this.phone = phone;
        this.address = address;
        this.gstNo = gstNo;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBusinessCategory() { return businessCategory; }
    public void setBusinessCategory(String businessCategory) { this.businessCategory = businessCategory; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocationLat() { return locationLat; }
    public void setLocationLat(String locationLat) { this.locationLat = locationLat; }

    public String getLocationLong() { return locationLong; }
    public void setLocationLong(String locationLong) { this.locationLong = locationLong; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGstNo() { return gstNo; }
    public void setGstNo(String gstNo) { this.gstNo = gstNo; }

    public String getBusinessPhoto() { return businessPhoto; }
    public void setBusinessPhoto(String businessPhoto) { this.businessPhoto = businessPhoto; }

    public String getBusinessIcon() { return businessIcon; }
    public void setBusinessIcon(String businessIcon) { this.businessIcon = businessIcon; }

}
