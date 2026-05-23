package com.pitchconnect.repository;

import com.pitchconnect.entity.GameMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<GameMatch, String> {
}
