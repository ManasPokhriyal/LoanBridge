package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderDTO {
    private String orderId;
    private Long loanAccountId;
    private Double amount;
    private String currency;
    private String key;
}
