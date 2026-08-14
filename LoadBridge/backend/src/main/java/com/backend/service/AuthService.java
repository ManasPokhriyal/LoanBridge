package com.backend.service;

import com.backend.dto.ApiResponse;
import com.backend.dto.AuthResponse;
import com.backend.dto.LoginRequest;
import com.backend.dto.RegisterConfirmRequest;
import com.backend.dto.RegisterInitRequest;
import com.backend.dto.UserDTO;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    ApiResponse registerInit(RegisterInitRequest request);
    AuthResponse registerConfirm(RegisterConfirmRequest request);
    UserDTO getMe(String authorizationHeader);
}
