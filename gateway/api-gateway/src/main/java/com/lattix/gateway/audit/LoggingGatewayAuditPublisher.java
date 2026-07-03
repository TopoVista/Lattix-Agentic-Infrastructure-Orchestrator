package com.lattix.gateway.audit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggingGatewayAuditPublisher implements GatewayAuditPublisher {
    private static final Logger log = LoggerFactory.getLogger(LoggingGatewayAuditPublisher.class);

    @Override
    public void publish(GatewayAuditEvent event) {
        log.info("gateway_audit actor={} workspace={} route={} method={} allowed={} reason={} status={} traceId={}",
                event.actor(), event.workspace(), event.route(), event.method(), event.decision().allowed(),
                event.decision().reason(), event.status(), event.traceId());
    }
}
