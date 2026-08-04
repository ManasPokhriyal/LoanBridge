package com.backend.dto;

import lombok.Getter;

@Getter
public class OtpData {
    private final String otp;
    private final long expiryTime;

    /**
     * Method 1: Timestamp Expiry Calculation
     * @param otp The generated 4-digit OTP code
     * @param validityInMinutes Minutes before OTP expires (e.g., 5 minutes)
     */
    public OtpData(String otp, long validityInMinutes) {
        this.otp = otp;
        this.expiryTime = System.currentTimeMillis() + (validityInMinutes * 60 * 1000);
    }

    public boolean isExpired() {
        return System.currentTimeMillis() > this.expiryTime;
    }
}
