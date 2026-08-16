package com.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Long applicationId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private Long offerId;
    private String bankName;
    private String loanType;
    private Double interestRate;
    private Double requestedAmount;
    private Integer tenureMonths;
    private String purpose;
    private Double calculatedEmi;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
}
