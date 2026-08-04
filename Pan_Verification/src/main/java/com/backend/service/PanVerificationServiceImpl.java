package com.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.dto.PanVerifyRequest;
import com.backend.dto.PanVerifyResponse;
import com.backend.entities.PanRecord;
import com.backend.exceptions.ApiException;
import com.backend.exceptions.ResourceNotFoundException;
import com.backend.repository.PanRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PanVerificationServiceImpl implements PanVerificationService {

    private final PanRecordRepository panRecordRepository;

    @Override
    public PanVerifyResponse verifyPan(PanVerifyRequest request) {
        String pan = request.getPan() != null ? request.getPan().toUpperCase().trim() : "";

        // 1. Format validation regex (5 uppercase letters, 4 digits, 1 uppercase letter)
        if (!pan.matches("^[A-Z]{5}[0-9]{4}[A-Z]$")) {
            throw new ApiException("Invalid PAN format. Example format: ABCDE1234F");
        }

        // 2. Query database for PAN record
        PanRecord record = panRecordRepository.findByPanNumber(pan)
                .orElseThrow(() -> new ResourceNotFoundException("PAN record not found in NSDL registry database for: " + pan));

        // 3. Return verified response from database
        return new PanVerifyResponse(true, record.getName(), record.getCreditScore(), pan, "PAN verified successfully");
    }
}
