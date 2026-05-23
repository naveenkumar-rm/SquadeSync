package com.pitchconnect.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "game_matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameMatch {
    @Id
    private String id;

    private String title;
    private String sport;
    private String gender;
    private String location;
    private String address;
    private Double lat;
    private Double lng;
    private String date;
    private String time;
    private Integer duration;
    private Double price;
    
    @Column(name = "pitch_type")
    private String pitchType;
    
    @Column(name = "max_players")
    private Integer maxPlayers;
    
    @Column(length = 1000)
    private String rules;

    @ManyToOne
    @JoinColumn(name = "host_id")
    private User host;

    @ManyToMany
    @JoinTable(
        name = "match_players",
        joinColumns = @JoinColumn(name = "match_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> currentPlayers;
}
