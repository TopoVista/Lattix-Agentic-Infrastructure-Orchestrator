package com.lattix.gateway.api;

import com.lattix.gateway.errors.GatewayFailure;
import com.lattix.gateway.errors.GatewayFailureMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/internal/gateway")
public class GatewayFallbackController {

    @GetMapping("/fallback/{routeId}")
    public Map<String, Object> fallback(@PathVariable String routeId) {
        GatewayFailure failure = GatewayFailureMapper.mapGatewayFailure(new IllegalStateException("Upstream route " + routeId + " is unavailable"));
        return Map.of(
                "code", failure.code(),
                "message", failure.message(),
                "routeId", routeId,
                "status", HttpStatus.SERVICE_UNAVAILABLE.value());
    }
}
