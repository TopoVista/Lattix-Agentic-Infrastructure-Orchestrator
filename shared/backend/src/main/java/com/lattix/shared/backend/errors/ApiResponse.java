package com.lattix.shared.backend.errors;

public class ApiResponse<T> {
    private final T data;
    private final ErrorResponse error;

    public ApiResponse(T data) {
        this.data = data;
        this.error = null;
    }

    public ApiResponse(ErrorResponse error) {
        this.data = null;
        this.error = error;
    }

    public T getData() {
        return data;
    }

    public ErrorResponse getError() {
        return error;
    }
}
