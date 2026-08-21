package com.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateApplicationRequest {
    @NotNull(message = "Loan Offer ID is required")
    private Long offerId;

    @NotNull(message = "Requested loan amount is required")
    @Positive(message = "Requested amount must be greater than zero")
    private Double requestedAmount;

    @NotNull(message = "Tenure months is required")
    @Positive(message = "Tenure months must be greater than zero")
    private Integer tenureMonths;

    private String purpose;
}
