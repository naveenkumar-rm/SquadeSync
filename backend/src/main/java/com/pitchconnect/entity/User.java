package com.pitchconnect.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
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
}
