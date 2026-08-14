package com.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.LoanOfferDTO;
import com.backend.entities.LoanOffer;
import com.backend.exceptions.ResourceNotFoundException;
import com.backend.repository.LoanOfferRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LoanOfferServiceImpl implements LoanOfferService {

    private final LoanOfferRepository loanOfferRepository;

    @Override
    public List<LoanOfferDTO> getAllOffers() {
        return loanOfferRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LoanOfferDTO getOfferById(Long offerId) {
        LoanOffer offer = loanOfferRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan Offer not found with ID: " + offerId));
        return mapToDTO(offer);
    }

    private LoanOfferDTO mapToDTO(LoanOffer offer) {
        return new LoanOfferDTO(
            offer.getOfferId(),
            offer.getBank() != null ? offer.getBank().getBankName() : "Partner Bank",
            offer.getBank() != null ? offer.getBank().getBankCode() : "BANK001",
            offer.getLoanType() != null ? offer.getLoanType().getLoanName() : "Loan",
            offer.getLoanType() != null ? offer.getLoanType().getDescription() : "",
            offer.getInterestRate(),
            offer.getMaxAmount(),
            offer.getMinCreditScore(),
            offer.getMaxTenureMonths(),
            offer.getProcessingFee(),
            offer.getIcon(),
            offer.getFeatured()
        );
    }
}
