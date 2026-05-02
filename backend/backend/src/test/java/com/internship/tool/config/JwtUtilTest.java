package com.internship.tool.config;

import com.internship.tool.entity.AppUser;
import com.internship.tool.entity.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private AppUser user;

    private static final String SECRET =
            "this-is-a-very-secure-secret-key-for-tool87-project-123456";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil(SECRET, 60000L);

        user = AppUser.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("encoded-password")
                .role(UserRole.USER)
                .enabled(true)
                .build();
    }

    // ✅ Token generation + validation
    @Test
    void shouldGenerateAndValidateAccessToken() {
        String token = jwtUtil.generateAccessToken(user);

        assertNotNull(token);
        assertTrue(jwtUtil.isAccessTokenValid(token, user));
    }

    // ✅ Username extraction
    @Test
    void shouldExtractUsernameFromToken() {
        String token = jwtUtil.generateAccessToken(user);

        String username = jwtUtil.extractUsername(token);

        assertEquals("test@example.com", username);
    }

    // ❌ Different user
    @Test
    void shouldFailForDifferentUser() {
        String token = jwtUtil.generateAccessToken(user);

        AppUser anotherUser = AppUser.builder()
                .email("other@example.com")
                .password("pass")
                .role(UserRole.USER)
                .enabled(true)
                .build();

        assertFalse(jwtUtil.isAccessTokenValid(token, anotherUser));
    }

    // ⏱️ Expiry test (stable)
    @Test
    void shouldFailIfTokenExpired() throws InterruptedException {

        JwtUtil shortJwt = new JwtUtil(SECRET, 50L); // increase buffer

        String token = shortJwt.generateAccessToken(user);

        Thread.sleep(100); // safe margin

        assertFalse(shortJwt.isAccessTokenValid(token, user));
    }

    // ❌ Invalid token format
    @Test
    void shouldFailForInvalidToken() {
        String invalidToken = "invalid.token.value";

        assertThrows(Exception.class, () ->
                jwtUtil.extractUsername(invalidToken)
        );
    }

    // ❌ Empty token
    @Test
    void shouldFailForEmptyToken() {
        assertThrows(Exception.class, () ->
                jwtUtil.extractUsername("")
        );
    }
}