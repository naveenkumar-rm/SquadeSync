package com.pitchconnect.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;

    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    private String avatar;
    private Integer reliability;
    
    @Column(name = "games_played")
    private Integer gamesPlayed;
    
    private Integer age;
    
    @Column(columnDefinition = "TEXT")
    private String bio;

    @ManyToMany(fetch = jakarta.persistence.FetchType.EAGER)
    @jakarta.persistence.JoinTable(
        name = "user_following",
        joinColumns = @jakarta.persistence.JoinColumn(name = "user_id"),
        inverseJoinColumns = @jakarta.persistence.JoinColumn(name = "following_id")
    )
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"following"})
    private java.util.List<User> following = new java.util.ArrayList<>();
}
