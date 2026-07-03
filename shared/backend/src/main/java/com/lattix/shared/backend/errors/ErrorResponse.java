package com.lattix.shared.backend.errors;

import java.time.Instant;

public class ErrorResponse {
    private final String timestamp = Instant.now().toString();
    private final String code;
    private final String message;

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
