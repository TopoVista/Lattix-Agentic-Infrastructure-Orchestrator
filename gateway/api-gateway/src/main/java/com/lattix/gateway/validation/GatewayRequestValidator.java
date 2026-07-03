package com.lattix.gateway.validation;

import com.lattix.gateway.config.GatewayProperties;
import com.lattix.gateway.errors.GatewayFailure;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.server.ServerWebExchange;

import java.util.Locale;
import java.util.Optional;

public class GatewayRequestValidator {
    private final GatewayProperties.Validation validation;

    public GatewayRequestValidator(GatewayProperties.Validation validation) {
        this.validation = validation;
    }

    public Optional<GatewayFailure> validate(ServerWebExchange exchange) {
        HttpMethod method = exchange.getRequest().getMethod();
        if (method == null || validation.allowedMethods().stream().noneMatch(allowed -> allowed.equalsIgnoreCase(method.name()))) {
            return Optional.of(GatewayFailure.validation("METHOD_NOT_ALLOWED", "HTTP method is not permitted"));
        }

        HttpHeaders headers = exchange.getRequest().getHeaders();
        MediaType contentType = headers.getContentType();
        if (contentType != null && validation.allowedContentTypes().stream()
                .noneMatch(allowed -> MediaType.valueOf(allowed).isCompatibleWith(contentType))) {
            return Optional.of(GatewayFailure.validation("UNSUPPORTED_MEDIA_TYPE", "Content type is not permitted"));
        }

        long contentLength = headers.getContentLength();
        if (contentLength > validation.maxPayloadBytes()) {
            return Optional.of(GatewayFailure.validation("PAYLOAD_TOO_LARGE", "Request payload exceeds the allowed size"));
        }

        return Optional.empty();
    }
}
