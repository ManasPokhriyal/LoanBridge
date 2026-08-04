package com.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.PanVerifyRequest;
import com.backend.dto.PanVerifyResponse;
import com.backend.service.PanVerificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PanVerificationController {

    private final PanVerificationService panVerificationService;

    @PostMapping("/pan/verify")
    public ResponseEntity<PanVerifyResponse> verifyPan(@RequestBody @Valid PanVerifyRequest request) {
        PanVerifyResponse response = panVerificationService.verifyPan(request);
        return new ResponseEntity<>(response, HttpStatus.valueOf(200));
    }
}
