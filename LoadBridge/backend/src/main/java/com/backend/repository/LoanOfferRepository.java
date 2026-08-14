package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.LoanOffer;

public interface LoanOfferRepository extends JpaRepository<LoanOffer, Long> {
}
