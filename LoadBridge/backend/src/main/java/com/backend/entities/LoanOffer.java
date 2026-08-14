package com.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "loan_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id")
    private Long offerId;

    @ManyToOne
    @JoinColumn(name = "bank_id", nullable = false)
    private Bank bank;

    @ManyToOne
    @JoinColumn(name = "loan_type_id", nullable = false)
    private LoanType loanType;

    @Column(name = "interest_rate", nullable = false)
    private Double interestRate;

    @Column(name = "max_amount", nullable = false)
    private Double maxAmount;

    @Column(name = "min_credit_score")
    private Integer minCreditScore;

    @Column(name = "max_tenure_months", nullable = false)
    private Integer maxTenureMonths;

    @Column(name = "processing_fee")
    private Double processingFee;

    private String icon;

    private Boolean featured = false;
}
