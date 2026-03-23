package com.geovendor.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "vendor")
public class Vendor {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "phone")
    private String phone;

    @Column(name = "city")
    private String city;

    @Column(name = "address")
    private String address;

    @Column(name = "profile_pic")
    private String profilePic;

    @Transient
    private VendorFeedback vf;

    public Vendor() {}

    public Vendor(String email, String name, String password, String phone,
                  String city, String address, String profilePic) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.phone = phone;
        this.city = city;
        this.address = address;
        this.profilePic = profilePic;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }


    public VendorFeedback getVf() { return vf; }
    public void setVf(VendorFeedback vf) { this.vf = vf; }
}
