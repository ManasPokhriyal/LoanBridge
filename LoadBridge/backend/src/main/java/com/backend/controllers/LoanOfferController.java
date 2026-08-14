package com.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.LoanOfferDTO;
import com.backend.service.LoanOfferService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/loan-offers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LoanOfferController {

    private final LoanOfferService loanOfferService;

    @GetMapping
    public ResponseEntity<List<LoanOfferDTO>> getAllOffers() {
        List<LoanOfferDTO> offers = loanOfferService.getAllOffers();
        return new ResponseEntity<>(offers, HttpStatus.valueOf(200));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanOfferDTO> getOfferById(@PathVariable("id") Long id) {
        LoanOfferDTO offer = loanOfferService.getOfferById(id);
        return new ResponseEntity<>(offer, HttpStatus.valueOf(200));
    }
}
