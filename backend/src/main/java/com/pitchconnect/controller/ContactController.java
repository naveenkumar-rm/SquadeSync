package com.pitchconnect.controller;

import com.pitchconnect.entity.ContactMessage;
import com.pitchconnect.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    @Autowired
    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submitContactMessage(@RequestBody ContactMessage message) {
        contactMessageRepository.save(message);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Contact message saved successfully");
        
        return ResponseEntity.ok(response);
    }
}
