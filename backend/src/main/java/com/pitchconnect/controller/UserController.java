package com.pitchconnect.controller;

import com.pitchconnect.entity.User;
import com.pitchconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
