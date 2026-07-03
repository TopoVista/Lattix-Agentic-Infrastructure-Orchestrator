package com.lattix.gateway.audit;

public interface GatewayAuditPublisher {
    void publish(GatewayAuditEvent event);
}
