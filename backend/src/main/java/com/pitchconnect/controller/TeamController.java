package com.pitchconnect.controller;

import com.pitchconnect.entity.Team;
import com.pitchconnect.entity.User;
import com.pitchconnect.repository.TeamRepository;
import com.pitchconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Autowired
    public TeamController(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team teamRequest) {
        if (teamRequest.getCaptain() == null || teamRequest.getCaptain().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<User> captainOpt = userRepository.findById(teamRequest.getCaptain().getId());
        if (captainOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        teamRequest.setId(UUID.randomUUID().toString());
        teamRequest.setCaptain(captainOpt.get());
        
        if (teamRequest.getMembers() == null) {
            teamRequest.setMembers(new ArrayList<>());
        }
        
        // Captain is always a member
        if (!teamRequest.getMembers().contains(captainOpt.get())) {
            teamRequest.getMembers().add(captainOpt.get());
        }

        if (teamRequest.getLogo() == null || teamRequest.getLogo().isEmpty()) {
            teamRequest.setLogo("https://api.dicebear.com/7.x/initials/svg?seed=" + teamRequest.getName());
        }

        Team savedTeam = teamRepository.save(teamRequest);
        return ResponseEntity.ok(savedTeam);
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable String id) {
        return teamRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{teamId}/members/{userId}")
    public ResponseEntity<Team> joinTeam(@PathVariable String teamId, @PathVariable String userId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (teamOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Team team = teamOpt.get();
        User user = userOpt.get();

        if (!team.getMembers().contains(user)) {
            team.getMembers().add(user);
            teamRepository.save(team);
        }

        return ResponseEntity.ok(team);
    }

    @PutMapping("/{teamId}/captain/{userId}")
    public ResponseEntity<Team> changeCaptain(@PathVariable String teamId, @PathVariable String userId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (teamOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Team team = teamOpt.get();
        User user = userOpt.get();

        // Ensure the new captain is a member of the team
        if (!team.getMembers().contains(user)) {
            team.getMembers().add(user);
        }

        team.setCaptain(user);
        Team savedTeam = teamRepository.save(team);

        return ResponseEntity.ok(savedTeam);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<Team> removeTeamMember(@PathVariable String teamId, @PathVariable String userId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (teamOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Team team = teamOpt.get();
        User user = userOpt.get();

        // Prevent removing the captain
        if (team.getCaptain() != null && team.getCaptain().getId().equals(userId)) {
            return ResponseEntity.badRequest().build();
        }

        if (team.getMembers().contains(user)) {
            team.getMembers().remove(user);
            teamRepository.save(team);
        }

        return ResponseEntity.ok(team);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        if (!teamRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        teamRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
