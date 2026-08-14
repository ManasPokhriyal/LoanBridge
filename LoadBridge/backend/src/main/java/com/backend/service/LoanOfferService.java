package com.backend.service;

import java.util.List;
import com.backend.dto.LoanOfferDTO;

public interface LoanOfferService {
    List<LoanOfferDTO> getAllOffers();
    LoanOfferDTO getOfferById(Long offerId);
}
