package com.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.LoanAccountDTO;
import com.backend.service.AdminService;
import com.backend.service.LoanAccountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LoanAccountController {

    private final LoanAccountService loanAccountService;
    private final AdminService adminService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<LoanAccountDTO> getAccountByUserId(@PathVariable("userId") Long userId) {
        LoanAccountDTO account = loanAccountService.getAccountByUserId(userId);
        return new ResponseEntity<>(account, HttpStatus.valueOf(200));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LoanAccountDTO>> getAllAccountsForAdmin() {
        List<LoanAccountDTO> accounts = adminService.getAllAccounts();
        return new ResponseEntity<>(accounts, HttpStatus.valueOf(200));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanAccountDTO> getAccountById(@PathVariable("id") Long id) {
        LoanAccountDTO account = loanAccountService.getAccountById(id);
        return new ResponseEntity<>(account, HttpStatus.valueOf(200));
    }
}
