package com.geovendor.dto;

import jakarta.validation.constraints.NotBlank;

public class LocationRequest {

    @NotBlank(message = "Latitude is required")
    private String lat;

    @NotBlank(message = "Longitude is required")
    private String lng;

    public LocationRequest() {}

    public LocationRequest(String lat, String lng) {
        this.lat = lat;
        this.lng = lng;
    }

    public String getLat() { return lat; }
    public void setLat(String lat) { this.lat = lat; }

    public String getLng() { return lng; }
    public void setLng(String lng) { this.lng = lng; }
}
