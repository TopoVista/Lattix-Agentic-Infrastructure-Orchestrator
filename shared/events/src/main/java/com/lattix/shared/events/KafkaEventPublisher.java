package com.lattix.shared.events;

import com.lattix.shared.backend.events.DomainEvent;

public class KafkaEventPublisher {
    public void publish(DomainEvent event) {
        // Placeholder: wire to KafkaTemplate in services that enable Kafka
        System.out.printf("(placeholder) publish event %s%n", event.getType());
    }
}
