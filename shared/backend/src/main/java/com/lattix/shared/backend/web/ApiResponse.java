package com.lattix.shared.backend.web;

import java.time.Instant;
import java.util.Map;

public class ApiResponse<T> {
    private String requestId;
    private Instant timestamp;
    private T data;
    private Map<String, Object> meta;

    public ApiResponse() {
    }

    public ApiResponse(String requestId, Instant timestamp, T data, Map<String, Object> meta) {
        this.requestId = requestId;
        this.timestamp = timestamp;
        this.data = data;
        this.meta = meta;
    }

    public static <T> ApiResponse<T> success(String requestId, T data, Map<String, Object> meta) {
        return new ApiResponse<>(requestId, Instant.now(), data, meta);
    }

    public String getRequestId() {
        return requestId;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public T getData() {
        return data;
    }

    public Map<String, Object> getMeta() {
        return meta;
    }
}
