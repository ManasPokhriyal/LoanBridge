package com.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.ApiResponse;
import com.backend.dto.OtpResponse;
import com.backend.dto.SendOtpRequest;
import com.backend.dto.VerifyOtpRequest;
import com.backend.service.OtpService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> sendOtp(@RequestBody @Valid SendOtpRequest request) {
        ApiResponse response = otpService.sendOtp(request.getEmail());
        return new ResponseEntity<>(response, HttpStatus.valueOf(200));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<OtpResponse> verifyOtp(@RequestBody @Valid VerifyOtpRequest request) {
        OtpResponse response = otpService.verifyOtp(request.getEmail(), request.getOtp());
        return new ResponseEntity<>(response, HttpStatus.valueOf(200));
    }
}
