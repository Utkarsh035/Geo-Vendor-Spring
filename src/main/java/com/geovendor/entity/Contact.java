package com.geovendor.entity;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "contact")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "qurey")
    private String qurey;

    @Column(name = "date")
    private Date date;

    public Contact() {}

    public Contact(String name, String email, String phone, String qurey, Date date) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.qurey = qurey;
        this.date = date;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getQurey() { return qurey; }
    public void setQurey(String qurey) { this.qurey = qurey; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
}
