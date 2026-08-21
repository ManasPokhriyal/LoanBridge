package com.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.CreateOrderRequest;
import com.backend.dto.PaymentOrderDTO;
import com.backend.dto.PaymentResultDTO;
import com.backend.dto.VerifyPaymentRequest;
import com.backend.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderDTO> createOrder(@RequestBody @Valid CreateOrderRequest request) {
        PaymentOrderDTO response = paymentService.createOrder(request);
        return new ResponseEntity<>(response, HttpStatus.valueOf(200));
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResultDTO> verifyPayment(@RequestBody @Valid VerifyPaymentRequest request) {
        PaymentResultDTO response = paymentService.verifyPayment(request);
        return new ResponseEntity<>(response, HttpStatus.valueOf(200));
    }
}
