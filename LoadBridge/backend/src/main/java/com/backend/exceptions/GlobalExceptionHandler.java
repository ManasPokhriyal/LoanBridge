package com.backend.exceptions;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.backend.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e) {
        return new ResponseEntity<>(new ApiResponse("Failed", e.getMessage()), HttpStatus.valueOf(404));
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResourceFoundException(org.springframework.web.servlet.resource.NoResourceFoundException e) {
        return new ResponseEntity<>(new ApiResponse("Failed", "Endpoint not found: " + e.getResourcePath()), HttpStatus.valueOf(404));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException e) {
        return new ResponseEntity<>(new ApiResponse("Failed", e.getMessage()), HttpStatus.valueOf(401));
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException e) {
        return new ResponseEntity<>(new ApiResponse("Failed", "Access Denied: You do not have permission to access this resource."), HttpStatus.valueOf(403));
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handleApiException(ApiException e) {
        return new ResponseEntity<>(new ApiResponse("Failed", e.getMessage()), HttpStatus.valueOf(400));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception e) {
        System.err.println("[BACKEND ERROR] Unhandled Exception: " + e);
        e.printStackTrace();
        String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getName();
        return new ResponseEntity<>(new ApiResponse("Failed", errorMsg), HttpStatus.valueOf(500));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<FieldError> fieldErrors = e.getFieldErrors();
        Map<String, String> fieldErrorMap = fieldErrors.stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage, (m1, m2) -> m1));
        return new ResponseEntity<>(fieldErrorMap, HttpStatus.valueOf(400));
    }
}
