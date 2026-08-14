package com.backend.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanAccountDTO {
    private Long loanAccountId;
    private Long applicationId;
    private Long userId;
    private String userName;
    private String bankName;
    private String loanType;
    private Double principal;
    private Double totalPayable;
    private Double totalPaid;
    private Double remainingBalance;
    private Double interestRate;
    private Integer tenureMonths;
    private Double monthlyEmi;
    private LocalDate nextDueDate;
    private String status;
    private LocalDate disbursedAt;
    private List<EmiScheduleDTO> emiSchedules;
}
