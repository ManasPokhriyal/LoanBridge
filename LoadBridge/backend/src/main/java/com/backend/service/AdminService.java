package com.backend.service;

import java.util.List;
import com.backend.dto.ApplicationDTO;
import com.backend.dto.LoanAccountDTO;

public interface AdminService {
    List<ApplicationDTO> getAllApplications();
    List<LoanAccountDTO> getAllAccounts();
    ApplicationDTO approveApplication(Long applicationId);
    ApplicationDTO rejectApplication(Long applicationId, String rejectionReason);
}

