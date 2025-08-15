package com.example.demo.controller.loginController;

import com.example.demo.models.entities.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            String token = JwtUtil.generateToken(user.getUsername(), user.getUserID());
            Integer role = user.getIsAdmin();
            return ResponseEntity.ok(new AuthResponse(token, role));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/protected")
    public ResponseEntity<?> protectedEndpoint(@RequestHeader("Authorization") String authHeader) {

        try {

            String token = authHeader.replace("Bearer ", "");
            String username = JwtUtil.extractUsername(token);
            return ResponseEntity.ok("Hello, " + username + "! You are authenticated.");

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }
    }
}

class AuthRequest {
    private String username;
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class AuthResponse {
    private String token;
    private Integer role;

    public AuthResponse(String token, Integer role) {
        this.token = token;
        this.role = role;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public String getToken() { return token; }
}

