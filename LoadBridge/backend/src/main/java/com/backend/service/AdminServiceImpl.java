package com.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.ApplicationDTO;
import com.backend.entities.EmiSchedule;
import com.backend.entities.EmiStatus;
import com.backend.entities.LoanAccount;
import com.backend.entities.LoanAccountStatus;
import com.backend.entities.LoanApplication;
import com.backend.entities.LoanApplicationStatus;
import com.backend.exceptions.ApiException;
import com.backend.exceptions.ResourceNotFoundException;
import com.backend.repository.EmiScheduleRepository;
import com.backend.repository.LoanAccountRepository;
import com.backend.repository.LoanApplicationRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanAccountRepository loanAccountRepository;
    private final EmiScheduleRepository emiScheduleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationDTO> getAllApplications() {
        return loanApplicationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.backend.dto.LoanAccountDTO> getAllAccounts() {
        return loanAccountRepository.findAll().stream()
                .map(account -> {
                    List<EmiSchedule> schedules = emiScheduleRepository.findByLoanAccountLoanAccountIdOrderByInstallmentNoAsc(account.getLoanAccountId());
                    List<com.backend.dto.EmiScheduleDTO> scheduleDTOs = schedules.stream()
                            .map(s -> new com.backend.dto.EmiScheduleDTO(
                                    s.getEmiId(),
                                    s.getInstallmentNo(),
                                    s.getDueDate(),
                                    s.getEmiAmount(),
                                    s.getTotalAmountDue(),
                                    s.getAmountPaid(),
                                    s.getStatus() != null ? s.getStatus().name() : "PENDING"
                            ))
                            .collect(Collectors.toList());

                    return new com.backend.dto.LoanAccountDTO(
                        account.getLoanAccountId(),
                        account.getApplication() != null ? account.getApplication().getApplicationId() : null,
                        account.getUser() != null ? account.getUser().getUserId() : null,
                        account.getUser() != null ? account.getUser().getName() : "Customer",
                        account.getBankName(),
                        account.getLoanType(),
                        account.getPrincipal(),
                        account.getTotalPayable(),
                        account.getTotalPaid(),
                        account.getRemainingBalance(),
                        account.getInterestRate(),
                        account.getTenureMonths(),
                        account.getMonthlyEmi(),
                        account.getNextDueDate(),
                        account.getStatus() != null ? account.getStatus().name() : "ACTIVE",
                        account.getDisbursedAt(),
                        scheduleDTOs
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationDTO approveApplication(Long applicationId) {
        LoanApplication application = loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (application.getStatus() == LoanApplicationStatus.APPROVED) {
            throw new ApiException("Application is already approved.");
        }
        if (application.getStatus() == LoanApplicationStatus.REJECTED) {
            throw new ApiException("Cannot approve a rejected application.");
        }

        // 1. Mark Application as APPROVED
        application.setStatus(LoanApplicationStatus.APPROVED);
        LoanApplication savedApp = loanApplicationRepository.save(application);

        // 2. Transactionally Create Active Loan Account
        LoanAccount account = new LoanAccount();
        account.setApplication(savedApp);
        account.setUser(savedApp.getUser());
        account.setBankName(savedApp.getOffer() != null && savedApp.getOffer().getBank() != null ? savedApp.getOffer().getBank().getBankName() : "Partner Bank");
        account.setLoanType(savedApp.getOffer() != null && savedApp.getOffer().getLoanType() != null ? savedApp.getOffer().getLoanType().getLoanName() : "Loan");
        account.setPrincipal(savedApp.getRequestedAmount());
        
        double monthlyEmi = savedApp.getCalculatedEmi();
        int tenureMonths = savedApp.getTenureMonths();
        double totalPayable = Math.round(monthlyEmi * tenureMonths * 100.0) / 100.0;

        account.setTotalPayable(totalPayable);
        account.setTotalPaid(0.0);
        account.setRemainingBalance(totalPayable);
        account.setInterestRate(savedApp.getOffer() != null ? savedApp.getOffer().getInterestRate() : 10.0);
        account.setTenureMonths(tenureMonths);
        account.setMonthlyEmi(monthlyEmi);
        account.setNextDueDate(LocalDate.now().plusMonths(1));
        account.setStatus(LoanAccountStatus.ACTIVE);
        account.setDisbursedAt(LocalDate.now());

        LoanAccount savedAccount = loanAccountRepository.save(account);

        // 3. Generate Monthly EMI Schedule
        for (int i = 1; i <= tenureMonths; i++) {
            EmiSchedule schedule = new EmiSchedule();
            schedule.setLoanAccount(savedAccount);
            schedule.setInstallmentNo(i);
            schedule.setDueDate(LocalDate.now().plusMonths(i));
            schedule.setEmiAmount(monthlyEmi);
            schedule.setTotalAmountDue(monthlyEmi);
            schedule.setAmountPaid(0.0);
            schedule.setStatus(EmiStatus.PENDING);
            emiScheduleRepository.save(schedule);
        }

        return mapToDTO(savedApp);
    }

    @Override
    public ApplicationDTO rejectApplication(Long applicationId, String rejectionReason) {
        LoanApplication application = loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (application.getStatus() == LoanApplicationStatus.APPROVED) {
            throw new ApiException("Cannot reject an already approved application.");
        }

        application.setStatus(LoanApplicationStatus.REJECTED);
        application.setRejectionReason(rejectionReason != null && !rejectionReason.trim().isEmpty() ? rejectionReason.trim() : "Credit or eligibility criteria not met.");
        LoanApplication savedApp = loanApplicationRepository.save(application);

        return mapToDTO(savedApp);
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
