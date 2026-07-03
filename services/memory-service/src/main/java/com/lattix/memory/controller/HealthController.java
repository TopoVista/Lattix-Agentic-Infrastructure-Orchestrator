package com.lattix.memory.controller;

import com.lattix.shared.backend.web.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, String>> health() {
        return ApiResponse.success("health", Map.of("status", "UP"), Map.of());
    }

    @GetMapping("/ready")
    public ApiResponse<Map<String, String>> readiness() {
        return ApiResponse.success("ready", Map.of("status", "READY"), Map.of());
    }

    @GetMapping("/live")
    public ApiResponse<Map<String, String>> liveness() {
        return ApiResponse.success("live", Map.of("status", "LIVE"), Map.of());
    }
}
