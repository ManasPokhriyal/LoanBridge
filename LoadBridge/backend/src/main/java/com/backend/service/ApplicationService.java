package com.backend.service;

import java.util.List;
import com.backend.dto.ApplicationDTO;
import com.backend.dto.CreateApplicationRequest;

public interface ApplicationService {
    ApplicationDTO applyForLoan(Long userId, CreateApplicationRequest request);
    List<ApplicationDTO> getApplicationsByUserId(Long userId);
    ApplicationDTO getApplicationById(Long applicationId);
}
