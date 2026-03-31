package com.geovendor.service;

import com.geovendor.entity.Business;
import com.geovendor.entity.Feedback;
import com.geovendor.entity.User;
import com.geovendor.repository.BusinessRepository;
import com.geovendor.repository.FeedbackRepository;
import com.geovendor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private BusinessRepository businessRepository;

    public boolean checkLogin(String email, String password) {
        User user = userRepository.findByEmailAndPassword(email, password);
        return user != null;
    }

    @Transactional
    public int registerUser(User user) {
        try {
            userRepository.save(user);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public boolean checkUserEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getUserProfile(String email) {
        return userRepository.findById(email).orElse(null);
    }

    @Transactional
    public int editProfile(User updatedUser, String email) {
        User existing = userRepository.findById(email).orElse(null);
        if (existing == null) return 0;
        existing.setName(updatedUser.getName());
        existing.setPhone(updatedUser.getPhone());
        existing.setCity(updatedUser.getCity());
        existing.setAddress(updatedUser.getAddress());
        existing.setProfilePic(updatedUser.getProfilePic());
        userRepository.save(existing);
        return 1;
    }

    @Transactional
    public int addFeedback(Feedback fd) {
        try {
            Feedback existing = feedbackRepository.findByEmaill(fd.getEmaill());
            if (existing == null) {
                feedbackRepository.save(fd);
            } else {
                existing.setRating(fd.getRating());
                existing.setRemark(fd.getRemark());
                existing.setDate(fd.getDate());
                feedbackRepository.save(existing);
            }
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public List<Business> viewAllBusiness() {
        return businessRepository.findAll();
    }

    public Business getBusinessByEmail(String email) {
        return businessRepository.findByEmail(email);
    }

    /**
     * Returns top 5-star feedbacks with user profile pics (for homepage).
     * Each User object has a transient Feedback attached via setFd().
     */
    public List<User> allFeedbacks() {
        List<Object[]> results = feedbackRepository.findTopFiveStarFeedbacks();
        List<User> userList = new ArrayList<>();
        for (Object[] row : results) {
            Feedback feed = new Feedback();
            feed.setName((String) row[0]);
            feed.setRating((String) row[1]);
            feed.setRemark((String) row[2]);

            User u = new User();
            u.setProfilePic((String) row[3]);
            u.setFd(feed);
            userList.add(u);
        }
        return userList;
    }
}
