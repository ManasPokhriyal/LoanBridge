package com.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.Payment;
import com.backend.entities.LoanAccount;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByLoanAccountOrderByPaymentDateDesc(LoanAccount loanAccount);
}
