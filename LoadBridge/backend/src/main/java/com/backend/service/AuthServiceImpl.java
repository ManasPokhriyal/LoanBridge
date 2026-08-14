package com.backend.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.backend.dto.ApiResponse;
import com.backend.dto.AuthResponse;
import com.backend.dto.LoginRequest;
import com.backend.dto.OtpResponse;
import com.backend.dto.PanVerifyRequest;
import com.backend.dto.PanVerifyResponse;
import com.backend.dto.RegisterConfirmRequest;
import com.backend.dto.RegisterInitRequest;
import com.backend.dto.SendOtpRequest;
import com.backend.dto.UserDTO;
import com.backend.dto.VerifyOtpRequest;
import com.backend.entities.Role;
import com.backend.entities.User;
import com.backend.exceptions.ApiException;
import com.backend.exceptions.AuthenticationException;
import com.backend.exceptions.ResourceNotFoundException;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ModelMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, PendingRegistration> pendingRegistrations = new ConcurrentHashMap<>();

    @Value("${pan.service.url:http://localhost:9090/api}")
    private String panServiceBaseUrl;

    @Getter
    @AllArgsConstructor
    private static class PendingRegistration {
        private RegisterInitRequest initData;
        private Integer creditScore;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail() != null ? request.getEmail().toLowerCase().trim() : "";
        String rawPassword = request.getPassword() != null ? request.getPassword().trim() : "";

        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanEmail, rawPassword)
            );

            User user = userRepository.findByEmail(cleanEmail)
                    .orElseThrow(() -> new AuthenticationException("No account found with email: " + cleanEmail));

            UserDTO userDTO = mapToUserDTO(user);
            String token = jwtUtils.generateToken(user.getEmail(), user.getUserId(), user.getRole().name(), user.getName());

            return new AuthResponse(token, userDTO);
        } catch (Exception e) {
            throw new AuthenticationException("Invalid email or password for " + cleanEmail);
        }
    }

    // Step 1: Verify PAN with Standalone Server (:9090) -> Automatically send 4-Digit OTP to Gmail!
    @Override
    public ApiResponse registerInit(RegisterInitRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new ApiException("Email address already registered. Please sign in.");
        }

        String pan = request.getPan() != null ? request.getPan().toUpperCase().trim() : "";
        if (!pan.matches("^[A-Z]{5}[0-9]{4}[A-Z]$")) {
            throw new ApiException("Enter a valid 10-character PAN number. Example: ABCDE1234F");
        }

        // Check if PAN card is already registered with an existing user
        if (userRepository.existsByPan(pan)) {
            throw new ApiException("PAN card number is already registered with an existing account.");
        }

        // 1. Verify PAN with Standalone PAN Server (:9090)
        PanVerifyResponse panResult;
        try {
            PanVerifyRequest panReq = new PanVerifyRequest();
            panReq.setPan(pan);
            panResult = callPanServiceToVerify(panReq);
        } catch (Exception e) {
            System.err.println("[MAIN BACKEND ERROR] Call to PAN Server on port 9090 failed: " + e.getMessage());
            throw new ApiException("PAN Verification Server (:9090) error: " + (e.getCause() != null ? e.getCause().getMessage() : e.getMessage()));
        }

        if (panResult == null || !panResult.isVerified()) {
            throw new ApiException("PAN details are incorrect or not found in NSDL database.");
        }

        // 2. Automatically trigger OTP email via Standalone Server (:9090)
        try {
            SendOtpRequest otpReq = new SendOtpRequest();
            otpReq.setEmail(cleanEmail);
            callOtpServiceToSend(otpReq);
        } catch (Exception e) {
            throw new ApiException("Failed to send 4-Digit OTP to " + cleanEmail + ". Please try again.");
        }

        // 3. Store pending registration data with official credit score
        pendingRegistrations.put(cleanEmail, new PendingRegistration(request, panResult.getCreditScore()));

        return new ApiResponse("Success", "PAN Verified Successfully! 4-Digit OTP sent to your email address.");
    }

    // Step 2: Validate 4-Digit OTP & Save User to MySQL loanbridge_db
    @Override
    public AuthResponse registerConfirm(RegisterConfirmRequest request) {
        String cleanEmail = request.getEmail().toLowerCase().trim();
        PendingRegistration pending = pendingRegistrations.get(cleanEmail);

        // 1. Verify 4-Digit OTP with Standalone PAN/OTP Server (:9090)
        try {
            VerifyOtpRequest otpReq = new VerifyOtpRequest();
            otpReq.setEmail(cleanEmail);
            otpReq.setOtp(request.getOtp().trim());
            callOtpServiceToVerify(otpReq);
        } catch (Exception e) {
            throw new ApiException("Invalid or expired OTP code. Please try again.");
        }

        // 2. Extract registration field values (use stored pending data or fallback to request body)
        String name = (pending != null && pending.getInitData() != null) ? pending.getInitData().getName() : request.getName();
        String rawPassword = (pending != null && pending.getInitData() != null) ? pending.getInitData().getPassword() : request.getPassword();
        String phone = (pending != null && pending.getInitData() != null) ? pending.getInitData().getPhone() : request.getPhone();
        String pan = (pending != null && pending.getInitData() != null) ? pending.getInitData().getPan() : request.getPan();
        Integer creditScore = (pending != null && pending.getCreditScore() != null) ? pending.getCreditScore() : 750;

        if (name == null || rawPassword == null) {
            throw new ApiException("Registration details incomplete. Please resubmit the registration form.");
        }

        // 3. Create & Save new User to database with BCrypt hashed password
        User user = new User();
        user.setName(name);
        user.setEmail(cleanEmail);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setPhone(phone);
        user.setPan(pan != null ? pan.toUpperCase().trim() : "");
        user.setCreditScore(creditScore);
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);
        pendingRegistrations.remove(cleanEmail); // Clear pending registration from memory

        // 4. Return AuthResponse containing JWT Token and User Profile DTO
        UserDTO userDTO = mapToUserDTO(savedUser);
        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getUserId(), savedUser.getRole().name(), savedUser.getName());

        return new AuthResponse(token, userDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getMe(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AuthenticationException("Session expired or missing token");
        }
        String token = authorizationHeader.substring(7);
        if (!jwtUtils.validateJwtToken(token)) {
            throw new AuthenticationException("Invalid or expired JWT token");
        }

        String email = jwtUtils.getUserNameFromJwtToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToUserDTO(user);
    }

    // --- Internal Private RestTemplate Helpers ---

    private PanVerifyResponse callPanServiceToVerify(PanVerifyRequest request) {
        String url = panServiceBaseUrl + "/pan/verify";
        ResponseEntity<PanVerifyResponse> response = restTemplate.postForEntity(url, request, PanVerifyResponse.class);
        return response.getBody();
    }

    private ApiResponse callOtpServiceToSend(SendOtpRequest request) {
        String url = panServiceBaseUrl + "/auth/send-otp";
        ResponseEntity<ApiResponse> response = restTemplate.postForEntity(url, request, ApiResponse.class);
        return response.getBody();
    }

    private OtpResponse callOtpServiceToVerify(VerifyOtpRequest request) {
        String url = panServiceBaseUrl + "/auth/verify-otp";
        ResponseEntity<OtpResponse> response = restTemplate.postForEntity(url, request, OtpResponse.class);
        return response.getBody();
    }

    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = mapper.map(user, UserDTO.class);
        dto.setId(user.getUserId());
        return dto;
    }
}
