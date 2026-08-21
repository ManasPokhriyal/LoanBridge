package com.backend.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmiScheduleDTO {
    private Long emiId;
    private Integer installmentNo;
    private LocalDate dueDate;
    private Double emiAmount;
    private Double totalAmountDue;
    private Double amountPaid;
    private String status;
}
