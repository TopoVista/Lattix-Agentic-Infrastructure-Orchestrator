# Kubernetes

## Purpose

Contains Kubernetes manifests, Helm charts, service mesh policies, namespaces, ingress, autoscaling, network policies, operators, and environment overlays.

## Owner Type

Platform engineering and SRE.

## Conventions

- Use reusable Helm charts for services and workers.
- Deny network traffic by default once policies are enforced.
- Secrets come from external secret references.
- Every workload needs probes, resource requests, limits, labels, and telemetry.
- Service mesh policy must be tested before enforcement.

## Future Phase Dependencies

- Phase 4 implements the Kubernetes platform.
- Phase 31 optimizes service mesh behavior.
- Phase 34 adds chaos engineering experiments.
