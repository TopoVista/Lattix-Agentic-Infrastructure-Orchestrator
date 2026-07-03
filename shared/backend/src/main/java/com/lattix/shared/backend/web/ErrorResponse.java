package com.lattix.shared.backend.web;

import java.time.Instant;
import java.util.Map;

public class ErrorResponse {
    private String requestId;
    private Instant timestamp;
    private String code;
    private String message;
    private Map<String, Object> details;
    private boolean retryable;

    public ErrorResponse() {
    }

    public ErrorResponse(String requestId, String code, String message, Map<String, Object> details,
            boolean retryable) {
        this.requestId = requestId;
        this.timestamp = Instant.now();
        this.code = code;
        this.message = message;
        this.details = details;
        this.retryable = retryable;
    }

    public String getRequestId() {
        return requestId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public boolean isRetryable() {
        return retryable;
    }
}
