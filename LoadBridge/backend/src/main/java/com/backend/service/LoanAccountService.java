package com.backend.service;

import com.backend.dto.LoanAccountDTO;

public interface LoanAccountService {
    LoanAccountDTO getAccountByUserId(Long userId);
    LoanAccountDTO getAccountById(Long accountId);
}
