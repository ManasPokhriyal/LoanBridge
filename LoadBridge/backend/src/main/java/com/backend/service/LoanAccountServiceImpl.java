package com.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.EmiScheduleDTO;
import com.backend.dto.LoanAccountDTO;
import com.backend.entities.EmiSchedule;
import com.backend.entities.LoanAccount;
import com.backend.exceptions.ResourceNotFoundException;
import com.backend.repository.EmiScheduleRepository;
import com.backend.repository.LoanAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class LoanAccountServiceImpl implements LoanAccountService {

    private final LoanAccountRepository loanAccountRepository;
    private final EmiScheduleRepository emiScheduleRepository;

    @Override
    public LoanAccountDTO getAccountByUserId(Long userId) {
        List<LoanAccount> accounts = loanAccountRepository.findByUserUserId(userId);
        if (accounts.isEmpty()) {
            throw new ResourceNotFoundException("No active or historical loan account found for user ID: " + userId);
        }

        // Return active loan account first, or most recent account
        LoanAccount account = accounts.stream()
                .filter(acc -> acc.getStatus() != null && acc.getStatus().name().equals("ACTIVE"))
                .findFirst()
                .orElse(accounts.get(accounts.size() - 1));

        return mapToDTO(account);
    }

    @Override
    public LoanAccountDTO getAccountById(Long accountId) {
        LoanAccount account = loanAccountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan Account not found with ID: " + accountId));

        return mapToDTO(account);
    }

    private LoanAccountDTO mapToDTO(LoanAccount account) {
        List<EmiSchedule> schedules = emiScheduleRepository.findByLoanAccountLoanAccountIdOrderByInstallmentNoAsc(account.getLoanAccountId());
        List<EmiScheduleDTO> scheduleDTOs = schedules.stream()
                .map(s -> new EmiScheduleDTO(
                        s.getEmiId(),
                        s.getInstallmentNo(),
                        s.getDueDate(),
                        s.getEmiAmount(),
                        s.getTotalAmountDue(),
                        s.getAmountPaid(),
                        s.getStatus() != null ? s.getStatus().name() : "PENDING"
                ))
                .collect(Collectors.toList());

        return new LoanAccountDTO(
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
    }
}
