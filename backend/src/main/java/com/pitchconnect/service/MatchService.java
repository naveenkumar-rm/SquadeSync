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

    @Autowired
    public MatchService(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
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
                match.getCurrentPlayers().add(user);
                return matchRepository.save(match);
            } else {
                throw new RuntimeException("Match is full");
            }
        }
        throw new RuntimeException("Match or User not found");
    }

    public void deleteMatch(String id) {
        matchRepository.deleteById(id);
    }
}
