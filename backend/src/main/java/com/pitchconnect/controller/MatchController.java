package com.pitchconnect.controller;

import com.pitchconnect.entity.GameMatch;
import com.pitchconnect.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public List<GameMatch> getAllMatches() {
        return matchService.getAllMatches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameMatch> getMatchById(@PathVariable String id) {
        return matchService.getMatchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GameMatch createMatch(@RequestBody GameMatch match) {
        return matchService.createMatch(match);
    }

    @PostMapping("/{matchId}/join")
    public ResponseEntity<GameMatch> joinMatch(@PathVariable String matchId, @RequestParam String userId) {
        try {
            GameMatch updatedMatch = matchService.joinMatch(matchId, userId);
            return ResponseEntity.ok(updatedMatch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{matchId}/join-team/{teamId}")
    public ResponseEntity<GameMatch> joinMatchAsTeam(@PathVariable String matchId, @PathVariable String teamId) {
        try {
            GameMatch updatedMatch = matchService.joinMatchAsTeam(matchId, teamId);
            return ResponseEntity.ok(updatedMatch);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable String id) {
        matchService.deleteMatch(id);
        return ResponseEntity.noContent().build();
    }
}
