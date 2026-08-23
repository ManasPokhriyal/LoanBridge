package com.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.EmiSchedule;
import com.backend.entities.LoanAccount;

public interface EmiScheduleRepository extends JpaRepository<EmiSchedule, Long> {
    List<EmiSchedule> findByLoanAccountOrderByInstallmentNoAsc(LoanAccount loanAccount);
    List<EmiSchedule> findByLoanAccountLoanAccountIdOrderByInstallmentNoAsc(Long loanAccountId);
}
