package com.internship.tool.controller;

import com.internship.tool.config.JwtUtil;
import com.internship.tool.dto.AuthResponse;
import com.internship.tool.dto.LoginRequest;
import com.internship.tool.dto.RegisterRequest;
import com.internship.tool.entity.AppUser;
import com.internship.tool.entity.UserRole;
import com.internship.tool.repository.AppUserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private AppUserRepository repository;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private AuthController controller;

    private AppUser user;

    @BeforeEach
    void setUp() {
        user = AppUser.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("encoded-password")
                .role(UserRole.USER)
                .enabled(true)
                .build();
    }

    // ================= REGISTER =================

    @Test
    void shouldRegisterNewUserSuccessfully() {

        RegisterRequest request = new RegisterRequest(
                "Test User",
                "TEST@EXAMPLE.COM", // test normalization
                "password123"
        );

        when(repository.existsByEmailIgnoreCase(any())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encoded-password");

        ResponseEntity<?> response = controller.register(request);

        assertEquals(200, response.getStatusCode().value());

        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("User registered successfully", body.get("message"));

        verify(repository).save(any(AppUser.class));
        verify(passwordEncoder).encode(request.password());
    }

    @Test
    void shouldRejectDuplicateEmail() {

        RegisterRequest request = new RegisterRequest(
                "Test User",
                "test@example.com",
                "password123"
        );

        when(repository.existsByEmailIgnoreCase(any())).thenReturn(true);

        ResponseEntity<?> response = controller.register(request);

        assertEquals(400, response.getStatusCode().value());

        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("User already exists", body.get("message"));

        verify(repository, never()).save(any());
    }

    // ================= LOGIN =================

    @Test
    void shouldLoginSuccessfully() {

        LoginRequest request = new LoginRequest(
                "test@example.com",
                "password123"
        );

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(repository.findByEmailIgnoreCase(request.email()))
                .thenReturn(Optional.of(user));
        when(jwtUtil.generateAccessToken(user))
                .thenReturn("test-token");

        ResponseEntity<?> response = controller.login(request);

        assertEquals(200, response.getStatusCode().value());

        // ✅ using DTO instead of Map
        AuthResponse body = (AuthResponse) response.getBody();

        assertNotNull(body);
        assertEquals("test-token", body.token());
        assertEquals("test@example.com", body.email());

        verify(authenticationManager).authenticate(any());
        verify(jwtUtil).generateAccessToken(user);
    }

    @Test
    void shouldFailLoginForInvalidCredentials() {

        LoginRequest request = new LoginRequest(
                "test@example.com",
                "wrong-password"
        );

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        ResponseEntity<?> response = controller.login(request);

        assertEquals(401, response.getStatusCode().value());

        Map<?, ?> body = (Map<?, ?>) response.getBody();
        assertEquals("Invalid email or password", body.get("message"));
    }

    @Test
    void shouldThrowIfUserNotFoundAfterAuthentication() {

        LoginRequest request = new LoginRequest(
                "test@example.com",
                "password123"
        );

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(repository.findByEmailIgnoreCase(request.email()))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> controller.login(request)
        );

        assertEquals("User not found", exception.getMessage());
    }
}