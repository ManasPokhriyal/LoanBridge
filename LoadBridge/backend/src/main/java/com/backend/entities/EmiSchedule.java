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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "emi_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmiSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emi_id")
    private Long emiId;

    @ManyToOne
    @JoinColumn(name = "loan_account_id", nullable = false)
    private LoanAccount loanAccount;

    @Column(name = "installment_no", nullable = false)
    private Integer installmentNo;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "principal_component")
    private Double principalComponent;

    @Column(name = "interest_component")
    private Double interestComponent;

    @Column(name = "processing_fee")
    private Double processingFee = 0.0;

    @Column(name = "emi_amount", nullable = false)
    private Double emiAmount;

    @Column(name = "total_amount_due", nullable = false)
    private Double totalAmountDue;

    @Column(name = "amount_paid")
    private Double amountPaid = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmiStatus status = EmiStatus.PENDING;
}
