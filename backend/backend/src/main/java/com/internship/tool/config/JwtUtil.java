package com.internship.tool.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String TOKEN_TYPE = "type";
    private static final String ACCESS = "access";

    private final SecretKey signingKey;
    private final long accessTokenExpiry;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-expiration-ms}") long accessTokenExpiry
    ) {
        this.signingKey = Keys.hmacShaKeyFor(hash(secret));
        this.accessTokenExpiry = accessTokenExpiry;
    }

    // 🔐 GENERATE TOKEN
    public String generateAccessToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpiry);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim(TOKEN_TYPE, ACCESS)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    // 🔍 EXTRACT USERNAME
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // ✅ VALIDATE TOKEN
    public boolean isAccessTokenValid(String token, UserDetails userDetails) {
        try {
            Claims claims = extractClaims(token);

            String username = claims.getSubject();
            String type = claims.get(TOKEN_TYPE, String.class);

            return username != null
                    && username.equals(userDetails.getUsername())
                    && ACCESS.equals(type)
                    && claims.getExpiration().after(new Date());

        } catch (Exception e) {
            System.out.println("JWT validation error: " + e.getMessage());
            return false;
        }
    }

    // 🔍 PARSE CLAIMS
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // 🔐 HASH SECRET
    private byte[] hash(String value) {
        try {
            return MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}