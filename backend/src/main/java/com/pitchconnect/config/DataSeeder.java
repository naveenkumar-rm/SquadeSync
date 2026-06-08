package com.pitchconnect.config;

import com.pitchconnect.entity.GameMatch;
import com.pitchconnect.entity.User;
import com.pitchconnect.repository.MatchRepository;
import com.pitchconnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, MatchRepository matchRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User("admin", "System Admin", "sysadmin", "admin@pitchconnect.com", "admin", "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin", 100, 0, null, null, new ArrayList<>());
                userRepository.save(admin);
            }
        };
    }
}
