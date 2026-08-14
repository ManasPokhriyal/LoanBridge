package com.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.ApiResponse;
import com.backend.dto.AuthResponse;
import com.backend.dto.LoginRequest;
import com.backend.dto.RegisterConfirmRequest;
import com.backend.dto.RegisterInitRequest;
import com.backend.dto.UserDTO;
import com.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        AuthResponse response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.valueOf(200));
    }

    @PostMapping("/auth/register-init")
    public ResponseEntity<ApiResponse> registerInit(@RequestBody @Valid RegisterInitRequest request) {
        ApiResponse response = authService.registerInit(request);
        return new ResponseEntity<>(response, HttpStatus.valueOf(200));
    }

    @PostMapping("/auth/register-confirm")
    public ResponseEntity<AuthResponse> registerConfirm(@RequestBody @Valid RegisterConfirmRequest request) {
        AuthResponse response = authService.registerConfirm(request);
        return new ResponseEntity<>(response, HttpStatus.valueOf(201));
    }

    @GetMapping("/auth/me")
    public ResponseEntity<UserDTO> getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        UserDTO user = authService.getMe(authHeader);
        return new ResponseEntity<>(user, HttpStatus.valueOf(200));
    }
}
