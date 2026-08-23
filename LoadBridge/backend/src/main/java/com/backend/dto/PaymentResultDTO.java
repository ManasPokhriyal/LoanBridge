package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResultDTO {
    private Long paymentId;
    private String status;
    private String message;
    private Double remainingBalance;
    private String accountStatus;
}
