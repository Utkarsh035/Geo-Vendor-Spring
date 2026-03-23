package com.geovendor.service;

import com.geovendor.entity.Contact;
import com.geovendor.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GuestService {

    @Autowired
    private ContactRepository contactRepository;

    @Transactional
    public int addContact(Contact contact) {
        try {
            contactRepository.save(contact);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
