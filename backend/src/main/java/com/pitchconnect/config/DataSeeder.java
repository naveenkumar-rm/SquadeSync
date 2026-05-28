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
                User admin = new User("admin", "System Admin", "admin@pitchconnect.com", "admin", "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin", 100, 0, null, null, new ArrayList<>());
                User alex = new User("u1", "Alex Mercer", "alex@example.com", "password", "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", 98, 42, null, null, new ArrayList<>());
                User john = new User("u2", "John D.", "john@example.com", "password", "https://api.dicebear.com/7.x/avataaars/svg?seed=John", 95, 30, null, null, new ArrayList<>());
                User sarah = new User("u3", "Sarah M.", "sarah@example.com", "password", "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", 90, 20, null, null, new ArrayList<>());
                User mike = new User("u4", "Mike T.", "mike@example.com", "password", "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", 85, 10, null, null, new ArrayList<>());
                
                userRepository.saveAll(List.of(admin, alex, john, sarah, mike));

                if (matchRepository.count() == 0) {
                    GameMatch match1 = new GameMatch();
                    match1.setId("m1");
                    match1.setTitle("7v7 Casual Evening Match");
                    match1.setSport("Football");
                    match1.setGender("Mixed");
                    match1.setLocation("Turf Park Bangalore");
                    match1.setAddress("Koramangala, Bangalore, Karnataka");
                    match1.setLat(12.9352);
                    match1.setLng(77.6245);
                    match1.setDate(java.time.LocalDate.now().toString());
                    match1.setTime("19:00");
                    match1.setDuration(60);
                    match1.setPrice(150.0);
                    match1.setPitchType("3G Artificial");
                    match1.setMaxPlayers(14);
                    match1.setHost(john);
                    match1.setRules("No slide tackles. Roll-on roll-off subs. Be respectful.");
                    match1.setCurrentPlayers(new ArrayList<>(List.of(john, sarah, mike)));
                    
                    GameMatch match2 = new GameMatch();
                    match2.setId("m2");
                    match2.setTitle("Morning Cricket Net Session");
                    match2.setSport("Cricket");
                    match2.setGender("Mixed");
                    match2.setLocation("Oval Maidan");
                    match2.setAddress("Maharshi Karve Rd, Churchgate, Mumbai, Maharashtra");
                    match2.setLat(18.9298);
                    match2.setLng(72.8288);
                    match2.setDate(java.time.LocalDate.now().plusDays(1).toString());
                    match2.setTime("10:00");
                    match2.setDuration(120);
                    match2.setPrice(200.0);
                    match2.setPitchType("Grass");
                    match2.setMaxPlayers(8);
                    match2.setHost(alex);
                    match2.setRules("Bring your own bat.");
                    match2.setCurrentPlayers(new ArrayList<>(List.of(alex, john)));

                    GameMatch match3 = new GameMatch();
                    match3.setId("m3");
                    match3.setTitle("5v5 Turf War");
                    match3.setSport("Football");
                    match3.setGender("Men Only");
                    match3.setLocation("JLN Stadium Turf");
                    match3.setAddress("Pragati Vihar, New Delhi, Delhi 110003");
                    match3.setLat(28.5828);
                    match3.setLng(77.2343);
                    match3.setDate(java.time.LocalDate.now().toString());
                    match3.setTime("20:00");
                    match3.setDuration(60);
                    match3.setPrice(120.0);
                    match3.setPitchType("Astroturf");
                    match3.setMaxPlayers(10);
                    match3.setHost(mike);
                    match3.setRules("Standard 5v5 rules.");
                    match3.setCurrentPlayers(new ArrayList<>(List.of(mike, john)));

                    GameMatch match4 = new GameMatch();
                    match4.setId("m4");
                    match4.setTitle("Beach Cricket Sunday");
                    match4.setSport("Cricket");
                    match4.setGender("Mixed");
                    match4.setLocation("Marina Beach");
                    match4.setAddress("Marina Beach, Chennai, Tamil Nadu");
                    match4.setLat(13.0500);
                    match4.setLng(80.2824);
                    match4.setDate(java.time.LocalDate.now().plusDays(1).toString());
                    match4.setTime("07:00");
                    match4.setDuration(180);
                    match4.setPrice(50.0);
                    match4.setPitchType("Sand");
                    match4.setMaxPlayers(22);
                    match4.setHost(sarah);
                    match4.setRules("Tennis ball cricket.");
                    match4.setCurrentPlayers(new ArrayList<>(List.of(sarah, alex, mike)));

                    GameMatch match5 = new GameMatch();
                    match5.setId("m5");
                    match5.setTitle("Bandra Football League");
                    match5.setSport("Football");
                    match5.setGender("Mixed");
                    match5.setLocation("Bandra Turf");
                    match5.setAddress("Bandra West, Mumbai, Maharashtra");
                    match5.setLat(19.0596);
                    match5.setLng(72.8295);
                    match5.setDate(java.time.LocalDate.now().toString());
                    match5.setTime("18:30");
                    match5.setDuration(90);
                    match5.setPrice(180.0);
                    match5.setPitchType("3G Artificial");
                    match5.setMaxPlayers(14);
                    match5.setHost(john);
                    match5.setRules("Friendly match.");
                    match5.setCurrentPlayers(new ArrayList<>(List.of(john, sarah)));

                    GameMatch match6 = new GameMatch();
                    match6.setId("m6");
                    match6.setTitle("Hyderabad Box Cricket");
                    match6.setSport("Cricket");
                    match6.setGender("Men Only");
                    match6.setLocation("Gachibowli Stadium");
                    match6.setAddress("Gachibowli, Hyderabad, Telangana");
                    match6.setLat(17.4401);
                    match6.setLng(78.3489);
                    match6.setDate(java.time.LocalDate.now().toString());
                    match6.setTime("21:00");
                    match6.setDuration(120);
                    match6.setPrice(250.0);
                    match6.setPitchType("Artificial Turf");
                    match6.setMaxPlayers(12);
                    match6.setHost(alex);
                    match6.setRules("Box cricket rules apply.");
                    match6.setCurrentPlayers(new ArrayList<>(List.of(alex, mike)));

                    GameMatch match7 = new GameMatch();
                    match7.setId("m7");
                    match7.setTitle("Pune Kickers");
                    match7.setSport("Football");
                    match7.setGender("Women Only");
                    match7.setLocation("Balewadi Stadium");
                    match7.setAddress("Balewadi, Pune, Maharashtra");
                    match7.setLat(18.5746);
                    match7.setLng(73.7667);
                    match7.setDate(java.time.LocalDate.now().plusDays(2).toString());
                    match7.setTime("17:00");
                    match7.setDuration(60);
                    match7.setPrice(100.0);
                    match7.setPitchType("Grass");
                    match7.setMaxPlayers(14);
                    match7.setHost(sarah);
                    match7.setRules("Women only beginner friendly match.");
                    match7.setCurrentPlayers(new ArrayList<>(List.of(sarah)));

                    GameMatch match8 = new GameMatch();
                    match8.setId("m8");
                    match8.setTitle("Salt Lake City Match");
                    match8.setSport("Football");
                    match8.setGender("Mixed");
                    match8.setLocation("Salt Lake Stadium");
                    match8.setAddress("Bidhannagar, Kolkata, West Bengal");
                    match8.setLat(22.5684);
                    match8.setLng(88.4068);
                    match8.setDate(java.time.LocalDate.now().plusDays(1).toString());
                    match8.setTime("19:30");
                    match8.setDuration(90);
                    match8.setPrice(140.0);
                    match8.setPitchType("Grass");
                    match8.setMaxPlayers(22);
                    match8.setHost(john);
                    match8.setRules("Full field 11v11.");
                    match8.setCurrentPlayers(new ArrayList<>(List.of(john, alex, mike, sarah)));

                    GameMatch match9 = new GameMatch();
                    match9.setId("m9");
                    match9.setTitle("Ahmedabad Gully Cricket");
                    match9.setSport("Cricket");
                    match9.setGender("Mixed");
                    match9.setLocation("Riverfront Park");
                    match9.setAddress("Sabarmati Riverfront, Ahmedabad, Gujarat");
                    match9.setLat(23.0225);
                    match9.setLng(72.5714);
                    match9.setDate(java.time.LocalDate.now().toString());
                    match9.setTime("08:00");
                    match9.setDuration(180);
                    match9.setPrice(40.0);
                    match9.setPitchType("Concrete");
                    match9.setMaxPlayers(16);
                    match9.setHost(mike);
                    match9.setRules("One tip one hand out.");
                    match9.setCurrentPlayers(new ArrayList<>(List.of(mike)));

                    GameMatch match10 = new GameMatch();
                    match10.setId("m10");
                    match10.setTitle("Indiranagar Night Football");
                    match10.setSport("Football");
                    match10.setGender("Mixed");
                    match10.setLocation("Indiranagar Turf");
                    match10.setAddress("Indiranagar, Bangalore, Karnataka");
                    match10.setLat(12.9784);
                    match10.setLng(77.6408);
                    match10.setDate(java.time.LocalDate.now().plusDays(3).toString());
                    match10.setTime("22:00");
                    match10.setDuration(60);
                    match10.setPrice(160.0);
                    match10.setPitchType("Astroturf");
                    match10.setMaxPlayers(10);
                    match10.setHost(alex);
                    match10.setRules("Late night fast paced game.");
                    match10.setCurrentPlayers(new ArrayList<>(List.of(alex, john)));

                    matchRepository.saveAll(List.of(match1, match2, match3, match4, match5, match6, match7, match8, match9, match10));
                }
            }
        };
    }
}
