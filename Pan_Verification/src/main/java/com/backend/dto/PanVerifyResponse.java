package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PanVerifyResponse {
    private boolean verified;
    private String name;
    private Integer creditScore;
    private String pan;
    private String message;
}
