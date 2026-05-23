package com.pitchconnect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "PitchConnect API is running smoothly! Please access the frontend at http://localhost:5173";
    }
}
