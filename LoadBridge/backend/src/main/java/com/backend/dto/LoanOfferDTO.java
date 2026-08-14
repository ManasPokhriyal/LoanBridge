package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanOfferDTO {
    private Long id;
    private String bankName;
    private String bankCode;
    private String loanType;
    private String loanTypeDescription;
    private Double interestRate;
    private Double maxAmount;
    private Integer minCreditScore;
    private Integer maxTenureMonths;
    private Double processingFee;
    private String icon;
    private Boolean featured;
}
