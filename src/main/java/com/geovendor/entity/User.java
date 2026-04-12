package com.geovendor.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "user")
public class User {

    @Id
    @Column(name = "email")
    private String email;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "city")
    private String city;

    @Column(name = "address")
    private String address;

    @Column(name = "profile_pic")
    private String profilePic;

    @Column(name = "date")
    private java.sql.Date date;

    @Transient
    private Feedback feedback;

    @Column(name = "favorite")
    private String favorite;

    public User() {}

    public User(String email, String password, String name, String phone,
                String city, String address, String profilePic, java.sql.Date date) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.city = city;
        this.address = address;
        this.profilePic = profilePic;
        this.date = date;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }


    public java.sql.Date getDate() { return date; }
    public void setDate(java.sql.Date date) { this.date = date; }

    public Feedback getFd() { return feedback; }
    public void setFd(Feedback feedback) { this.feedback = feedback; }

    public String getFavorite() { return favorite; }
    public void setFavorite(String favorite) { this.favorite = favorite; }
}
