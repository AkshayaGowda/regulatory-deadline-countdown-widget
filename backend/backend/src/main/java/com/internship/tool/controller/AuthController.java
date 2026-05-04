package com.internship.tool.controller;

import com.internship.tool.config.JwtUtil;
import com.internship.tool.dto.LoginRequest;
import com.internship.tool.dto.RegisterRequest;
import com.internship.tool.entity.AppUser;
import com.internship.tool.entity.UserRole;
import com.internship.tool.repository.AppUserRepository;
import com.internship.tool.service.DeadlineEmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository repository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder encoder;
    private final DeadlineEmailService emailService;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        String email = request.email().toLowerCase().trim();

        if (repository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User already exists"));
        }

        AppUser user = AppUser.builder()
                .name(request.name())
                .email(email)
                .password(encoder.encode(request.password()))
                .role(UserRole.USER)
                .enabled(true)
                .build();

        repository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        String email = request.email().toLowerCase().trim();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        AppUser user = repository.findByEmailIgnoreCase(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "User not found"));
        }

        String token = jwtUtil.generateAccessToken(user);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name()
        ));
    }

    // ================= FORGOT PASSWORD =================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        Optional<AppUser> optionalUser =
                repository.findByEmailIgnoreCase(email.trim().toLowerCase());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not found"));
        }

        AppUser user = optionalUser.get();

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setTokenExpiry(Instant.now().plusSeconds(900)); // 15 min

        repository.save(user);

        String link = "http://localhost:5173/reset?token=" + token;

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), link);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to send email"));
        }

        return ResponseEntity.ok(Map.of("message", "Reset link sent to email"));
    }

    // ================= RESET PASSWORD =================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid request"));
        }

        Optional<AppUser> optionalUser =
                repository.findByResetTokenAndTokenExpiryAfterAndEnabledTrue(token, Instant.now());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid or expired token"));
        }

        AppUser user = optionalUser.get();

        user.setPassword(encoder.encode(newPassword));
        user.setResetToken(null);
        user.setTokenExpiry(null);

        repository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}