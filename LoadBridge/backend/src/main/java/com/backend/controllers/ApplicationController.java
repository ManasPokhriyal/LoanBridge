package com.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.ApplicationDTO;
import com.backend.dto.CreateApplicationRequest;
import com.backend.entities.User;
import com.backend.exceptions.ApiException;
import com.backend.repository.UserRepository;
import com.backend.service.ApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApplicationDTO> applyForLoan(
            @RequestBody @Valid CreateApplicationRequest request,
            @RequestParam(value = "userId", required = false) Long paramUserId) {

        Long targetUserId = paramUserId;

        // Extract user from SecurityContext if paramUserId not provided
        if (targetUserId == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                String email = auth.getName();
                User currentUser = userRepository.findByEmail(email)
                        .orElseThrow(() -> new ApiException("User not found for email: " + email));
                targetUserId = currentUser.getUserId();
            }
        }

        if (targetUserId == null) {
            throw new ApiException("User ID is required to submit a loan application.");
        }

        ApplicationDTO response = applicationService.applyForLoan(targetUserId, request);
        return new ResponseEntity<>(response, HttpStatus.valueOf(201));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsByUserId(@PathVariable("userId") Long userId) {
        List<ApplicationDTO> applications = applicationService.getApplicationsByUserId(userId);
        return new ResponseEntity<>(applications, HttpStatus.valueOf(200));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDTO> getApplicationById(@PathVariable("id") Long id) {
        ApplicationDTO application = applicationService.getApplicationById(id);
        return new ResponseEntity<>(application, HttpStatus.valueOf(200));
    }
}
