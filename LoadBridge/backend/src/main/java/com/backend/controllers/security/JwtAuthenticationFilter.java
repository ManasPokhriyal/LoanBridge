package com.backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filter that intercepts every incoming HTTP request to extract and validate the JWT.
 * If valid, populates Spring's SecurityContextHolder with the authenticated user.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. Extract raw JWT token string from Authorization header
            String jwt = parseJwtFromHeader(request);

            // 2. Validate token signature & expiration date
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // 3. Extract user email from token payload
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                // 4. Load full UserDetails object from database
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 5. Construct Spring Authentication token & attach web request details
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Set active user in Spring SecurityContext for the current request
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.err.println("[JWT FILTER] Failed to authenticate request: " + e.getMessage());
        }

        // Proceed with request processing in filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Helper method to extract the JWT token string from the "Authorization: Bearer <token>" header.
     */
    private String parseJwtFromHeader(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
