package com.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyPaymentRequest {
    @NotNull(message = "Loan Account ID is required")
    private Long loanAccountId;

    @NotNull(message = "Payment amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @JsonProperty("razorpayOrderId")
    @JsonAlias({"razorpay_order_id", "orderId"})
    private String razorpayOrderId;

    @JsonProperty("razorpayPaymentId")
    @JsonAlias({"razorpay_payment_id", "paymentId"})
    private String razorpayPaymentId;

    @JsonProperty("razorpaySignature")
    @JsonAlias({"razorpay_signature", "signature"})
    private String razorpaySignature;

    @JsonProperty("method")
    @JsonAlias({"paymentMethod", "paymentMode"})
    private String method;
}
