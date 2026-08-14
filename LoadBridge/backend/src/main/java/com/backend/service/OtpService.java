package com.backend.service;

import com.backend.dto.ApiResponse;
import com.backend.dto.OtpResponse;

public interface OtpService {
    ApiResponse sendOtp(String email);
    OtpResponse verifyOtp(String email, String enteredOtp);
}
