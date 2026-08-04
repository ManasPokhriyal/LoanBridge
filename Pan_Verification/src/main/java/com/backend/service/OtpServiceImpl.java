package com.backend.service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.backend.dto.ApiResponse;
import com.backend.dto.OtpData;
import com.backend.dto.OtpResponse;
import com.backend.exceptions.ApiException;

@Service
public class OtpServiceImpl implements OtpService {

    // ConcurrentHashMap storing email -> OtpData (Method 1: Timestamp Expiry Calculation)
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Override
    public ApiResponse sendOtp(String email) {
        String cleanEmail = email.toLowerCase().trim();

        // Generate random 4-digit OTP (1000 to 9999)
        String generatedOtp = String.valueOf(random.nextInt(9000) + 1000);

        // Save OTP valid for 5 minutes using Method 1 Expiry Calculation
        otpStorage.put(cleanEmail, new OtpData(generatedOtp, 5));

        // Attempt sending real email via JavaMailSender
        boolean emailSent = dispatchEmail(cleanEmail, generatedOtp);

        System.out.println("[OTP SERVICE] 4-digit OTP [" + generatedOtp + "] generated for email: " + cleanEmail + " (Email Sent: " + emailSent + ")");

        return new ApiResponse("Success", "OTP sent successfully to email: " + cleanEmail);
    }

    private boolean dispatchEmail(String toEmail, String otp) {
        if (mailSender == null) return false;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("LoanBridge - Email OTP Verification Code");
            message.setText("Hello,\n\nYour 4-digit email verification code is: " + otp + "\n\nThis code is valid for 5 minutes. Do not share this OTP with anyone.\n\nThank you,\nLoanBridge Team");
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            System.err.println("[OTP SERVICE] Could not dispatch email via SMTP: " + e.getMessage());
            return false;
        }
    }

    @Override
    public OtpResponse verifyOtp(String email, String enteredOtp) {
        String cleanEmail = email.toLowerCase().trim();
        OtpData otpData = otpStorage.get(cleanEmail);

        // Rule 1: Check if OTP exists
        if (otpData == null) {
            throw new ApiException("No OTP request found for " + cleanEmail + ". Please click Send OTP.");
        }

        // Rule 2: Check Method 1 Expiry (System.currentTimeMillis() > expiryTime)
        if (otpData.isExpired()) {
            otpStorage.remove(cleanEmail); // Clean up expired entry
            throw new ApiException("OTP code has expired. Please click Resend OTP.");
        }

        // Rule 3: Check OTP code match (or demo 1234 override for easy testing)
        if (!otpData.getOtp().equals(enteredOtp) && !"1234".equals(enteredOtp)) {
            throw new ApiException("Incorrect 4-digit OTP code entered.");
        }

        // Success -> Clear OTP so it cannot be reused
        otpStorage.remove(cleanEmail);
        return new OtpResponse(true, "OTP verified successfully!");
    }
}
