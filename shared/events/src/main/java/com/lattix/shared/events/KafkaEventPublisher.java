package com.lattix.shared.events;

import com.lattix.shared.backend.events.DomainEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class KafkaEventPublisher {
    private static final Logger log = LoggerFactory.getLogger(KafkaEventPublisher.class);

    public void publish(DomainEvent event) {
        // Placeholder: wire to KafkaTemplate in services that enable Kafka
        log.info("(placeholder) publish event {}", event.getType());
    }
}
