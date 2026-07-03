# Phase 04 - Kubernetes Platform

## Goal

Create the Kubernetes platform layer that hosts Lattix services consistently across local, staging, and production environments.

## Why This Phase Exists

Lattix will run many services, agents, workers, data connectors, and observability components. Kubernetes provides the common runtime, but only if namespaces, policies, ingress, secrets, autoscaling, service mesh, and Helm conventions are defined early.

## Success Criteria

- Namespaces, ingress, service mesh, Helm charts, autoscaling, network policies, secrets, persistent volumes, and operators are planned and installable.
- Local Kubernetes can mirror key cloud behavior.
- Workload conventions are documented for all future services.
- Platform add-ons are versioned and deployed through GitOps-ready manifests.

## Deliverables

- Kubernetes namespace model.
- Helm chart conventions.
- Base and environment overlays.
- Istio or service mesh installation plan.
- Ingress controller and certificate integration.
- Network policy and secret management standards.

## Folder Structure

```text
kubernetes/
  base/
    namespaces/
    policies/
    ingress/
    mesh/
    observability/
  environments/
    local/
    dev/
    staging/
    prod/
  charts/
    lattix-service/
    lattix-worker/
  operators/
```

## Modules To Build

- Namespace module for `platform`, `gateway`, `services`, `agents`, `ai`, `data`, `observability`, and `tools`.
- Ingress module for HTTP routing and TLS.
- Mesh module for mTLS, retries, traffic shifting, and telemetry.
- Autoscaling module for HPA and VPA defaults.
- Policy module for network, pod security, resource quotas, and limit ranges.
- Secret module for external secret integration.

## Functionality

- Deploy services through reusable Helm charts.
- Enforce least-privilege networking between namespaces.
- Route external traffic through gateway and ingress only.
- Support persistent volumes for stateful workloads that are not fully managed services.
- Support local, dev, staging, and production overlays.

## Tech Stack

- Kubernetes.
- Helm.
- Istio.
- NGINX Ingress or AWS Load Balancer Controller.
- External Secrets Operator.
- cert-manager.
- KEDA for event-driven scaling where needed.
- HPA and VPA.
- NetworkPolicy.

## Implementation Plan

1. Define namespaces and labels for tenancy, environment, owner, and data sensitivity.
2. Create base Helm chart templates for services and workers.
3. Add ingress rules for gateway and internal tools.
4. Add service mesh installation and default mTLS policy.
5. Add resource requests, limits, HPA, VPA, pod disruption budgets, and topology spread constraints.
6. Add network policies that deny by default and allow approved flows.
7. Add External Secrets integration for cloud secrets.
8. Add persistent volume conventions for local and cloud storage classes.
9. Add Kubernetes validation to CI.

## Functions / Classes / Interfaces To Implement

```yaml
kind: HelmChartTemplate
# Defines standard deployment, service, config, secrets, probes, autoscaling, and telemetry fields.

createNamespacePolicy(input: NamespacePolicyInput): NetworkPolicy
# Generates namespace allow rules for approved service-to-service communication.

renderServiceValues(input: ServiceDeploymentInput): HelmValues
# Converts service metadata into chart values for an environment.

validateKubernetesManifest(input: ManifestValidationInput): ValidationReport
# Checks policy, resource limits, labels, probes, and forbidden fields before deployment.
```

## Configuration / Environment Variables

- `KUBECONFIG`
- `LATTIX_K8S_ENV`
- `LATTIX_CLUSTER_NAME`
- `LATTIX_INGRESS_DOMAIN`
- `LATTIX_CERT_ISSUER`
- `LATTIX_MESH_ENABLED`

## Data Models / Schemas / Contracts

- `ServiceDeploymentInput`: name, image, tag, env, secrets, ports, probes, resources, autoscaling.
- `NamespacePolicyInput`: namespace, allowed ingress, allowed egress, mesh mode.
- `HelmValues`: deployment, service, config, secrets, ingress, autoscaling, observability.

## Testing Plan

- Run kubeconform or kubeval against all manifests.
- Run Helm template rendering for local, dev, staging, and prod.
- Run policy checks with conftest or Kyverno tests.
- Deploy base platform to local kind or k3d cluster.
- Confirm mTLS, ingress, DNS, and secret sync behavior.

## Acceptance Criteria

- New services can be deployed by supplying chart values instead of custom manifests.
- Network access is denied by default and explicitly allowed.
- Services have probes, resource limits, labels, telemetry, and autoscaling defaults.
- Local Kubernetes can run enough of the platform for development.

## Risks And Mitigations

- Risk: mesh complexity slows development. Mitigation: support local mesh-off profile while keeping staging/prod mesh-on.
- Risk: policies block valid traffic. Mitigation: add policy tests and a documented allow-list workflow.
- Risk: Helm values drift across services. Mitigation: use reusable chart templates and schema validation.

## Next Phase Handoff

Phase 5 should deploy backend services using the standard Kubernetes chart and namespace conventions.

## Implemented Artifacts

- Platform base: `kubernetes/base/kustomization.yaml` with namespaces, mesh policies, ingress, secrets, autoscaling, and storage conventions.
- Environment overlays: `kubernetes/environments/{local,dev,staging,prod}` with ingress host and mesh behavior patches.
- Reusable charts: enhanced `lattix-service` and `lattix-worker` templates with schema validation, HPA, PDB, network policy, and service monitor support.
- Operator boundary: `kubernetes/operators` namespaces for cert-manager, external-secrets, istio, keda, and vpa control planes.
- Validation pipeline: `scripts/k8s/validate-manifests.ps1` plus `.github/workflows/kubernetes-platform.yml`.
- Runtime config contract: `config/env/kubernetes.env.example`.
