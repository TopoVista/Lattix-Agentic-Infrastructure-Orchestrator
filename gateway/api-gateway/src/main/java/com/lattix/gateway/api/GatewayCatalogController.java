package com.lattix.gateway.api;

import com.lattix.gateway.config.GatewayProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/gateway")
public class GatewayCatalogController {
    private final GatewayProperties properties;

    public GatewayCatalogController(GatewayProperties properties) {
        this.properties = properties;
    }

    @GetMapping("/openapi")
    public Map<String, Object> openApiCatalog() {
        return Map.of(
                "services", properties.routes().stream().map(route -> Map.of(
                        "id", route.id(),
                        "serviceName", route.serviceName(),
                        "path", route.path(),
                        "docsPath", "/api/v1/" + route.serviceName() + "/v3/api-docs")).toList(),
                "version", "v1");
    }
}
