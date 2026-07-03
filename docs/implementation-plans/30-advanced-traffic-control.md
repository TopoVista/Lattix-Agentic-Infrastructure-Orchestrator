# Phase 30 - Advanced Traffic Control

## Goal

Add advanced traffic control for Lattix through adaptive rate limiting, load balancing, CDN integration, traffic shaping, and abuse protection.

## Why This Phase Exists

High-scale systems need more than static limits. Lattix must protect APIs, agents, expensive AI calls, search, graph queries, cloud actions, and downloads from overload while preserving good user experience for legitimate workloads.

## Success Criteria

- Advanced rate limits support route, actor, workspace, tenant, token, IP, cost, and risk dimensions.
- Adaptive limits react to service health, error rate, latency, and budget.
- CDN serves static assets and safe cached responses.
- Load balancing policies are observable and tunable.
- Abuse and anomaly signals feed security and observability.

## Deliverables

- Rate limit policy engine.
- Adaptive limit controller.
- Load balancing policy.
- CDN configuration.
- Traffic shaping rules.
- Abuse detection signals.
- Dashboards and alerts.

## Folder Structure

```text
gateway/
  api-gateway/src/main/java/com/lattix/gateway/traffic/
shared/
  traffic-control/
cloud/
  edge/
observability/
  dashboards/traffic/
security/
  abuse-detection/
```

## Modules To Build

- Multi-dimensional rate limit module.
- Adaptive controller module.
- Load balancing module.
- CDN module.
- Traffic shaping module.
- Abuse signal module.
- Traffic observability module.

## Functionality

- Assign request cost by endpoint, model, graph depth, file size, query complexity, and cloud action risk.
- Enforce quotas by user, workspace, tenant, token, IP, and route.
- Adjust limits during incidents, deployments, high latency, budget spikes, or downstream saturation.
- Use CDN for frontend assets, docs, safe downloads, and cacheable public metadata.
- Shape traffic for expensive AI, search, graph, and export flows.
- Emit abuse signals for suspicious patterns.

## Tech Stack

- Spring Cloud Gateway.
- Redis Cluster.
- Resilience4j.
- CloudFront or equivalent CDN.
- AWS WAF or edge firewall integration.
- Prometheus and Grafana.

## Implementation Plan

1. Define request cost model and rate limit dimensions.
2. Extend gateway rate limiting to support weighted requests and hierarchical quotas.
3. Implement adaptive controller that consumes latency, error rate, saturation, budget, and incident signals.
4. Add traffic classes: interactive, batch, agent, background, admin, export, cloud-action.
5. Configure CDN for frontend assets and safe static content.
6. Add load balancing policy for service instances and regional targets when available.
7. Add abuse detection events for high-risk traffic patterns.
8. Add dashboards for allowed, limited, rejected, cost, latency, and quota usage.

## Functions / Classes / Interfaces To Implement

```java
RequestCost calculateRequestCost(TrafficRequest request)
// Computes cost units from route, payload, model, graph depth, file size, and risk.

RateLimitDecision evaluateAdvancedLimit(TrafficRequest request)
// Applies user, workspace, tenant, token, IP, route, and cost quota policies.

AdaptiveLimit updateAdaptiveLimit(ServiceHealthWindow window)
// Adjusts quotas based on latency, error rate, saturation, incidents, and budget pressure.

TrafficClass classifyTraffic(TrafficRequest request)
// Labels requests as interactive, batch, agent, admin, export, background, or cloud-action.

AbuseSignal detectAbusePattern(TrafficWindow window)
// Flags suspicious patterns for security and policy review.
```

## Configuration / Environment Variables

- `TRAFFIC_CONTROL_ENABLED`
- `RATE_LIMIT_POLICY_FILE`
- `ADAPTIVE_LIMITS_ENABLED`
- `RATE_LIMIT_REDIS_URL`
- `CDN_DISTRIBUTION_ID`
- `TRAFFIC_ABUSE_SIGNAL_ENABLED`
- `MAX_AI_REQUEST_COST`

## Data Models / Schemas / Contracts

- `TrafficRequest`: actor, workspace, token, ip, route, method, costInputs.
- `RequestCost`: units, reasons, risk, class.
- `RateLimitPolicy`: dimension, quota, window, burst, priority, action.
- `AdaptiveLimit`: route, currentQuota, reason, expiresAt.
- `AbuseSignal`: actor, pattern, severity, evidence, recommendedAction.

## Testing Plan

- Unit tests for cost calculation and quota evaluation.
- Integration tests with Redis-backed distributed limits.
- Adaptive limit tests with synthetic health windows.
- CDN configuration validation.
- Load tests for rate-limited and allowed traffic.

## Acceptance Criteria

- Expensive requests consume more quota than cheap requests.
- Limits adapt during unhealthy service conditions.
- CDN reduces repeated static traffic.
- Users receive clear limit responses with reset metadata.

## Risks And Mitigations

- Risk: adaptive limits punish legitimate spikes. Mitigation: traffic classes, priority, grace windows, and manual override.
- Risk: CDN caches sensitive data. Mitigation: cache only approved public/static content and safe responses.
- Risk: abuse detection creates false positives. Mitigation: severity levels and human review for enforcement.

## Next Phase Handoff

Phase 31 should tune service mesh traffic, security, telemetry, and policy for scaled service-to-service operation.
