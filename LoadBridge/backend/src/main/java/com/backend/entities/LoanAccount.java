package com.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "loan_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loan_account_id")
    private Long loanAccountId;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private LoanApplication application;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "loan_type")
    private String loanType;

    @Column(nullable = false)
    private Double principal;

    @Column(name = "total_payable", nullable = false)
    private Double totalPayable;

    @Column(name = "total_paid")
    private Double totalPaid = 0.0;

    @Column(name = "remaining_balance", nullable = false)
    private Double remainingBalance;

    @Column(name = "interest_rate")
    private Double interestRate;

    @Column(name = "tenure_months")
    private Integer tenureMonths;

    @Column(name = "monthly_emi")
    private Double monthlyEmi;

    @Column(name = "next_due_date")
    private LocalDate nextDueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanAccountStatus status = LoanAccountStatus.ACTIVE;

    @Column(name = "disbursed_at")
    private LocalDate disbursedAt = LocalDate.now();
}
