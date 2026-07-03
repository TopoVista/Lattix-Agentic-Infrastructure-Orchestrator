package com.lattix.shared.backend.events;

import java.time.Instant;
import java.util.Map;

public class DomainEvent {
    private String id;
    private String type;
    private String aggregateId;
    private Instant occurredAt;
    private Map<String, Object> payload;

    public DomainEvent(String id, String type, String aggregateId, Instant occurredAt, Map<String, Object> payload) {
        this.id = id;
        this.type = type;
        this.aggregateId = aggregateId;
        this.occurredAt = occurredAt;
        this.payload = payload;
    }

    public String getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getAggregateId() {
        return aggregateId;
    }

    public Instant getOccurredAt() {
        return occurredAt;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }
}
