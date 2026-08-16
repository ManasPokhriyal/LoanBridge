package com.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.access.prepost.PreAuthorize;

import com.backend.dto.ApplicationDTO;
import com.backend.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/all")
    public ResponseEntity<List<ApplicationDTO>> getAllApplications() {
        List<ApplicationDTO> applications = adminService.getAllApplications();
        return new ResponseEntity<>(applications, HttpStatus.valueOf(200));
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<com.backend.dto.LoanAccountDTO>> getAllAccounts() {
        List<com.backend.dto.LoanAccountDTO> accounts = adminService.getAllAccounts();
        return new ResponseEntity<>(accounts, HttpStatus.valueOf(200));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApplicationDTO> approveApplication(@PathVariable("id") Long id) {
        ApplicationDTO application = adminService.approveApplication(id);
        return new ResponseEntity<>(application, HttpStatus.valueOf(200));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApplicationDTO> rejectApplication(
            @PathVariable("id") Long id,
            @RequestParam(value = "reason", required = false) String reason) {

        ApplicationDTO application = adminService.rejectApplication(id, reason);
        return new ResponseEntity<>(application, HttpStatus.valueOf(200));
    }
}
