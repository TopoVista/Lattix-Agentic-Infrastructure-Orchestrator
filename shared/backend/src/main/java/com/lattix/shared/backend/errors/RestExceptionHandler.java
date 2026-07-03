package com.lattix.shared.backend.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ErrorResponse> handleDomainException(DomainException ex) {
        ErrorResponse response = new ErrorResponse(ex.getCode(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler({ MethodArgumentNotValidException.class, BindException.class })
    public ResponseEntity<ErrorResponse> handleValidationException(Exception ex) {
        String message = "Validation failed";
        if (ex instanceof MethodArgumentNotValidException manve && !manve.getBindingResult().getAllErrors().isEmpty()) {
            message = manve.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        } else if (ex instanceof BindException be && !be.getBindingResult().getAllErrors().isEmpty()) {
            message = be.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        }
        ErrorResponse response = new ErrorResponse("validation_error", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse response = new ErrorResponse("internal_error", "An unexpected error occurred.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
