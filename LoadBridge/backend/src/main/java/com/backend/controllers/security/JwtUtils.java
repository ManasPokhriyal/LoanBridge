package com.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * Simplified Utility class for JSON Web Token (JWT) management.
 * Provides a single method for token generation, signature validation, and claims parsing.
 */
@Component
public class JwtUtils {

    @Value("${jwt.secret:LoanBridgeSecretKeyForJWTAuthTokenGeneration2026123456789}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private long jwtExpirationMs;

    // Helper to generate HMAC signing key from the secret string
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Single consolidated token generator: Builds and signs a JWT with user claims.
     * Replaces previous duplicate wrapper methods.
     */
    public String generateToken(String email, Long userId, String role, String name) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .claim("name", name)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts the subject (username/email) from the token claims.
     */
    public String getUserNameFromJwtToken(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Validates if a JWT token is properly signed and not expired.
     */
    public boolean validateJwtToken(String authToken) {
        try {
            getClaims(authToken);
            return true;
        } catch (Exception e) {
            System.err.println("[JWT UTILS] Invalid or expired JWT Token: " + e.getMessage());
            return false;
        }
    }

    /**
     * Helper to parse and return payload claims from a signed JWT string.
     */
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
