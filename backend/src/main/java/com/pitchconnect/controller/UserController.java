package com.pitchconnect.controller;

import com.pitchconnect.entity.User;
import com.pitchconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userUpdates) {
        return userService.getUserById(id)
                .map(existingUser -> {
                    if (userUpdates.getName() != null) existingUser.setName(userUpdates.getName());
                    if (userUpdates.getUsername() != null) existingUser.setUsername(userUpdates.getUsername());
                    if (userUpdates.getAvatar() != null) existingUser.setAvatar(userUpdates.getAvatar());
                    if (userUpdates.getAge() != null) existingUser.setAge(userUpdates.getAge());
                    if (userUpdates.getBio() != null) existingUser.setBio(userUpdates.getBio());
                    User savedUser = userService.saveUser(existingUser);
                    return ResponseEntity.ok(savedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<User> followUser(@PathVariable String userId, @PathVariable String targetId) {
        return userService.getUserById(userId).flatMap(user -> 
            userService.getUserById(targetId).map(target -> {
                if (!user.getFollowing().contains(target) && !user.getId().equals(target.getId())) {
                    user.getFollowing().add(target);
                    userService.saveUser(user);
                }
                return ResponseEntity.ok(user);
            })
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}/follow/{targetId}")
    public ResponseEntity<User> unfollowUser(@PathVariable String userId, @PathVariable String targetId) {
        return userService.getUserById(userId).flatMap(user -> 
            userService.getUserById(targetId).map(target -> {
                if (user.getFollowing().contains(target)) {
                    user.getFollowing().remove(target);
                    userService.saveUser(user);
                }
                return ResponseEntity.ok(user);
            })
        ).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<User>> getFollowing(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(user -> ResponseEntity.ok(user.getFollowing()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<User>> getFollowers(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    List<User> followers = userService.getAllUsers().stream()
                            .filter(u -> u.getFollowing().contains(user))
                            .toList();
                    return ResponseEntity.ok(followers);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<User> uploadAvatar(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return userService.getUserById(id).map(user -> {
            try {
                // Ensure the uploads directory exists
                Path uploadDir = Paths.get("uploads/avatars");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                // Generate a unique file name
                String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar.jpg");
                String extension = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String fileName = UUID.randomUUID().toString() + extension;
                
                // Save the file
                Path targetLocation = uploadDir.resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                // Update the user's avatar URL
                String fileUrl = "http://localhost:8081/uploads/avatars/" + fileName;
                user.setAvatar(fileUrl);
                User savedUser = userService.saveUser(user);
                
                return ResponseEntity.ok(savedUser);
            } catch (IOException ex) {
                return ResponseEntity.internalServerError().<User>build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
