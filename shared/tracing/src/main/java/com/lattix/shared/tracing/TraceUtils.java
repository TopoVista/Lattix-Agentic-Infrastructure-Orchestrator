package com.lattix.shared.tracing;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;

public class TraceUtils {
    private static final Tracer tracer = io.opentelemetry.api.GlobalOpenTelemetry.getTracer("com.lattix.tracing");

    public static Span startSpan(String name) {
        return tracer.spanBuilder(name).startSpan();
    }
}
