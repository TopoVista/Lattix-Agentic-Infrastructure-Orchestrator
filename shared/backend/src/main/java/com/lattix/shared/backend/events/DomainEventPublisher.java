package com.lattix.shared.backend.events;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DomainEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(DomainEventPublisher.class);

    public void publish(DomainEvent event) {
        log.info("Publishing domain event {} to event transport", event.getType());
    }
}
