package com.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.ApplicationDTO;
import com.backend.dto.CreateApplicationRequest;
import com.backend.entities.LoanAccountStatus;
import com.backend.entities.LoanApplication;
import com.backend.entities.LoanApplicationStatus;
import com.backend.entities.LoanOffer;
import com.backend.entities.User;
import com.backend.exceptions.ApiException;
import com.backend.exceptions.ResourceNotFoundException;
import com.backend.repository.LoanAccountRepository;
import com.backend.repository.LoanApplicationRepository;
import com.backend.repository.LoanOfferRepository;
import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanAccountRepository loanAccountRepository;
    private final LoanOfferRepository loanOfferRepository;
    private final UserRepository userRepository;

    @Override
    public ApplicationDTO applyForLoan(Long userId, CreateApplicationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // 1. Enforce 1-Active-Loan Rule (Only 1 PENDING application or 1 ACTIVE loan account allowed)
        boolean hasPendingApplication = loanApplicationRepository.existsByUserUserIdAndStatusIn(
                userId, List.of(LoanApplicationStatus.PENDING)
        );
        boolean hasActiveAccount = loanAccountRepository.existsByUserUserIdAndStatus(
                userId, LoanAccountStatus.ACTIVE
        );

        if (hasPendingApplication || hasActiveAccount) {
            throw new ApiException("You already have a pending application or active loan in progress. Only 1 active loan is allowed at a time.");
        }

        // 2. Fetch Loan Offer
        LoanOffer offer = loanOfferRepository.findById(request.getOfferId())
                .orElseThrow(() -> new ResourceNotFoundException("Loan Offer not found with ID: " + request.getOfferId()));

        // 3. Verify Credit Score
        Integer userScore = user.getCreditScore() != null ? user.getCreditScore() : 300;
        Integer minRequired = offer.getMinCreditScore() != null ? offer.getMinCreditScore() : 650;
        if (userScore < minRequired) {
            throw new ApiException("Your credit score (" + userScore + ") is below the minimum required credit score (" + minRequired + ") for this offer.");
        }

        // 4. Validate Amount and Tenure Limits
        if (request.getRequestedAmount() > offer.getMaxAmount()) {
            throw new ApiException("Requested amount (₹" + request.getRequestedAmount() + ") exceeds maximum limit (₹" + offer.getMaxAmount() + ") for this offer.");
        }

        if (request.getTenureMonths() > offer.getMaxTenureMonths()) {
            throw new ApiException("Requested tenure (" + request.getTenureMonths() + " months) exceeds maximum allowed tenure (" + offer.getMaxTenureMonths() + " months).");
        }

        // 5. Calculate EMI using Standard Reducing Balance Formula
        double principal = request.getRequestedAmount();
        double annualRate = offer.getInterestRate();
        int months = request.getTenureMonths();

        double monthlyRate = (annualRate / 12.0) / 100.0;
        double emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        double roundedEmi = Math.round(emi * 100.0) / 100.0;

        // 6. Create LoanApplication Entity
        LoanApplication application = new LoanApplication();
        application.setUser(user);
        application.setOffer(offer);
        application.setRequestedAmount(principal);
        application.setTenureMonths(months);
        application.setPurpose(request.getPurpose() != null ? request.getPurpose().trim() : "Personal Needs");
        application.setCalculatedEmi(roundedEmi);
        application.setStatus(LoanApplicationStatus.PENDING);

        LoanApplication savedApp = loanApplicationRepository.save(application);
        return mapToDTO(savedApp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationDTO> getApplicationsByUserId(Long userId) {
        return loanApplicationRepository.findByUserUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationDTO getApplicationById(Long applicationId) {
        LoanApplication app = loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));
        return mapToDTO(app);
    }

    private ApplicationDTO mapToDTO(LoanApplication app) {
        return new ApplicationDTO(
            app.getApplicationId(),
            app.getUser() != null ? app.getUser().getUserId() : null,
            app.getUser() != null ? app.getUser().getName() : "Applicant",
            app.getUser() != null ? app.getUser().getEmail() : "",
            app.getUser() != null ? app.getUser().getPhone() : "",
            app.getOffer() != null ? app.getOffer().getOfferId() : null,
            (app.getOffer() != null && app.getOffer().getBank() != null) ? app.getOffer().getBank().getBankName() : "Partner Bank",
            (app.getOffer() != null && app.getOffer().getLoanType() != null) ? app.getOffer().getLoanType().getLoanName() : "Loan",
            app.getOffer() != null ? app.getOffer().getInterestRate() : 10.0,
            app.getRequestedAmount(),
            app.getTenureMonths(),
            app.getPurpose(),
            app.getCalculatedEmi(),
            app.getStatus() != null ? app.getStatus().name() : "PENDING",
            app.getRejectionReason(),
            app.getCreatedAt()
        );
    }
}
