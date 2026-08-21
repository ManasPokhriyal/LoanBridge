package com.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.LoanApplication;
import com.backend.entities.LoanApplicationStatus;
import com.backend.entities.User;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByUser(User user);
    List<LoanApplication> findByUserUserId(Long userId);
    List<LoanApplication> findByStatus(LoanApplicationStatus status);
    boolean existsByUserUserIdAndStatusIn(Long userId, List<LoanApplicationStatus> statuses);
    long countByStatus(LoanApplicationStatus status);
}
