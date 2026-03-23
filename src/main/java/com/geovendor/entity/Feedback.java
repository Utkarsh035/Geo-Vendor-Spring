package com.geovendor.entity;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "emaill")
    private String emaill;

    @Column(name = "rating")
    private String rating;

    @Column(name = "remark")
    private String remark;

    @Column(name = "date")
    private Date date;

    public Feedback() {}

    public Feedback(String name, String emaill, String rating, String remark, Date date) {
        this.name = name;
        this.emaill = emaill;
        this.rating = rating;
        this.remark = remark;
        this.date = date;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmaill() { return emaill; }
    public void setEmaill(String emaill) { this.emaill = emaill; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
}
