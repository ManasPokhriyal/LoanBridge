package com.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PanVerifyRequest {
    @NotBlank(message = "PAN number is required")
    private String pan;
}
