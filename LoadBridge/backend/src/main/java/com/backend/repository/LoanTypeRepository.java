package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.LoanType;

public interface LoanTypeRepository extends JpaRepository<LoanType, Long> {
}
