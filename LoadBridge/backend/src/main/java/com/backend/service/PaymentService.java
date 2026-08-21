package com.backend.service;

import com.backend.dto.CreateOrderRequest;
import com.backend.dto.PaymentOrderDTO;
import com.backend.dto.PaymentResultDTO;
import com.backend.dto.VerifyPaymentRequest;

public interface PaymentService {
    PaymentOrderDTO createOrder(CreateOrderRequest request);
    PaymentResultDTO verifyPayment(VerifyPaymentRequest request);
}
