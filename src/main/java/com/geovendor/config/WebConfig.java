package com.geovendor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files (profile images, vendor images)
        String uploadPath = System.getProperty("user.dir") + File.separator + uploadDir + File.separator;
        registry.addResourceHandler("/profileImages/**")
                .addResourceLocations("file:" + uploadPath + "profileImages/");
        registry.addResourceHandler("/vendorImages/**")
                .addResourceLocations("file:" + uploadPath + "vendorImages/");
    }
}
