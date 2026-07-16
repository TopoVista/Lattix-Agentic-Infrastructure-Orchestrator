package com.lattix.shared.events;

import com.lattix.shared.backend.events.DomainEvent;
import com.lattix.shared.events.model.EventEnvelope;
import com.lattix.shared.events.transport.PublishedMessage;

import java.util.function.Consumer;

public class KafkaEventPublisher extends com.lattix.shared.events.transport.KafkaEventPublisher {
    public KafkaEventPublisher() {
        super();
    }

    public KafkaEventPublisher(String topic, Consumer<PublishedMessage> sink) {
        super(topic, sink);
    }

    public PublishedMessage publishDomainEvent(DomainEvent event) {
        return super.publish(event);
    }

    public PublishedMessage publishEnvelope(EventEnvelope envelope) {
        return super.publish(envelope);
    }
}
