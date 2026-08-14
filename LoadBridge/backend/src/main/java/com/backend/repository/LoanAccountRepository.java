package com.backend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.LoanAccount;
import com.backend.entities.LoanAccountStatus;
import com.backend.entities.User;

public interface LoanAccountRepository extends JpaRepository<LoanAccount, Long> {
    List<LoanAccount> findByUser(User user);
    List<LoanAccount> findByUserUserId(Long userId);
    Optional<LoanAccount> findByUserUserIdAndStatus(Long userId, LoanAccountStatus status);
    boolean existsByUserUserIdAndStatus(Long userId, LoanAccountStatus status);
    List<LoanAccount> findByStatus(LoanAccountStatus status);
    long countByStatus(LoanAccountStatus status);
}
