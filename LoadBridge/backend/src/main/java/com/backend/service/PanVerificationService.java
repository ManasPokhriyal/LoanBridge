package com.backend.service;

import com.backend.dto.PanVerifyRequest;
import com.backend.dto.PanVerifyResponse;

public interface PanVerificationService {
    PanVerifyResponse verifyPan(PanVerifyRequest request);
}
