package com.pitchconnect.controller;

import com.pitchconnect.entity.User;
import com.pitchconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null || user.getName() == null) {
            return ResponseEntity.badRequest().body("Name, email, and password are required");
        }
        
        Optional<User> existing = userRepository.findByEmail(user.getEmail());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        user.setId(UUID.randomUUID().toString());
        user.setReliability(100);
        user.setGamesPlayed(0);
        if (user.getAvatar() == null) {
            user.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getName().replace(" ", ""));
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody User loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Optional<User> existing = userRepository.findByEmail(loginRequest.getEmail());
        if (existing.isPresent() && existing.get().getPassword() != null && existing.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(existing.get());
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }
}
