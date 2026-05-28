package com.pitchconnect.service;

import com.pitchconnect.entity.GameMatch;
import com.pitchconnect.entity.User;
import com.pitchconnect.repository.MatchRepository;
import com.pitchconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatchService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final com.pitchconnect.repository.TeamRepository teamRepository;

    @Autowired
    public MatchService(MatchRepository matchRepository, UserRepository userRepository, com.pitchconnect.repository.TeamRepository teamRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    public List<GameMatch> getAllMatches() {
        return matchRepository.findAll();
    }

    public Optional<GameMatch> getMatchById(String id) {
        return matchRepository.findById(id);
    }

    public GameMatch createMatch(GameMatch match) {
        return matchRepository.save(match);
    }

    public GameMatch joinMatch(String matchId, String userId) {
        Optional<GameMatch> matchOpt = matchRepository.findById(matchId);
        Optional<User> userOpt = userRepository.findById(userId);

        if (matchOpt.isPresent() && userOpt.isPresent()) {
            GameMatch match = matchOpt.get();
            User user = userOpt.get();

            if (match.getCurrentPlayers().size() < match.getMaxPlayers()) {
                if (!match.getCurrentPlayers().contains(user)) {
                    match.getCurrentPlayers().add(user);
                    return matchRepository.save(match);
                }
                return match; // already joined
            } else {
                throw new RuntimeException("Match is full");
            }
        }
        throw new RuntimeException("Match or User not found");
    }

    public GameMatch joinMatchAsTeam(String matchId, String teamId) {
        Optional<GameMatch> matchOpt = matchRepository.findById(matchId);
        Optional<com.pitchconnect.entity.Team> teamOpt = teamRepository.findById(teamId);

        if (matchOpt.isPresent() && teamOpt.isPresent()) {
            GameMatch match = matchOpt.get();
            com.pitchconnect.entity.Team team = teamOpt.get();
            List<User> members = team.getMembers();

            if (match.getCurrentPlayers().size() + members.size() <= match.getMaxPlayers()) {
                for (User member : members) {
                    if (!match.getCurrentPlayers().contains(member)) {
                        match.getCurrentPlayers().add(member);
                    }
                }
                return matchRepository.save(match);
            } else {
                throw new RuntimeException("Not enough spots in the match for the entire team");
            }
        }
        throw new RuntimeException("Match or Team not found");
    }

    public void deleteMatch(String id) {
        matchRepository.deleteById(id);
    }
}
