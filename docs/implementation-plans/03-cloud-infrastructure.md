# Phase 03 - Cloud Infrastructure

## Goal

Provision the AWS-first cloud foundation for Lattix using Terraform, while keeping GCP and Azure expansion paths clean.

## Why This Phase Exists

Cloud resources define the operational boundary of the platform. Terraform-managed infrastructure ensures reproducibility, reviewability, drift detection, and a controlled path from local development to staging and production.

## Success Criteria

- AWS VPC, subnets, security groups, IAM, KMS, S3, ECR, RDS, Redis, Kafka, EKS, CloudWatch, ALB, CloudFront, DNS, and secrets foundations are defined.
- Terraform state, modules, environments, and variable conventions are documented.
- GCP and Azure are represented through provider-neutral module boundaries, even if not fully provisioned yet.
- Cost tags and ownership tags are required on all resources.

## Deliverables

- Terraform root modules for `local`, `dev`, `staging`, and `prod`.
- Reusable modules for networking, identity, storage, compute, data, observability, and DNS.
- Backend state configuration.
- Cloud architecture diagram.
- Cost and tagging policy.

## Folder Structure

```text
terraform/
  environments/
    dev/
    staging/
    prod/
  modules/
    aws-network/
    aws-identity/
    aws-data/
    aws-observability/
    aws-kubernetes/
    aws-edge/
    provider-abstractions/
cloud/
  aws/
  gcp/
  azure/
docs/
  operations/
```

## Modules To Build

- Network module for VPC, public/private subnets, route tables, NAT, and security groups.
- Identity module for IAM roles, policies, OIDC, and least-privilege service accounts.
- Data module for RDS, Redis, S3, Kafka, and secrets.
- Kubernetes module for EKS cluster, node groups, and cluster access.
- Edge module for ALB, CloudFront, DNS, and certificates.
- Observability module for CloudWatch logs, metrics, and alarms.

## Functionality

- Provision cloud resources from reviewed Terraform plans.
- Enforce tags, encryption, least privilege, private networking, and environment separation.
- Support separate state per environment.
- Export outputs consumed by Kubernetes and deployment phases.

## Tech Stack

- Terraform.
- AWS provider.
- Remote Terraform state in S3 with DynamoDB locking.
- AWS IAM Identity Center or OIDC federation.
- AWS KMS, S3, ECR, RDS PostgreSQL, ElastiCache Redis, MSK or managed Kafka, EKS, CloudWatch, ALB, CloudFront, Route 53, ACM.

## Implementation Plan

1. Create Terraform module boundaries and environment directories.
2. Configure remote state and locking for each environment.
3. Implement networking with public, private, and data subnets across availability zones.
4. Implement IAM roles for CI, EKS, workloads, Terraform, and operators.
5. Implement encrypted storage, registry, database, cache, Kafka, secrets, and KMS resources.
6. Implement EKS control plane and managed node groups.
7. Implement edge networking with ALB, CloudFront, certificates, and DNS placeholders.
8. Add cost tags and required variable validations.
9. Add `terraform fmt`, `validate`, and plan checks to CI.

## Functions / Classes / Interfaces To Implement

```hcl
module "aws_network" {}
# Creates VPC, subnets, routing, NAT, security groups, and network outputs.

module "aws_identity" {}
# Creates IAM roles, trust policies, workload identities, and permission boundaries.

module "aws_data" {}
# Creates encrypted databases, object storage, cache, Kafka, and secret stores.

module "aws_kubernetes" {}
# Creates EKS cluster, node groups, IAM bindings, and cluster access outputs.
```

## Configuration / Environment Variables

- `AWS_REGION`
- `AWS_PROFILE`
- `TF_VAR_environment`
- `TF_VAR_project_name=lattix`
- `TF_VAR_cost_center`
- `TF_VAR_owner`
- `TF_VAR_domain_name`

## Data Models / Schemas / Contracts

- `CloudEnvironment`: name, account, region, state backend, allowed CIDRs, tags.
- `NetworkOutputs`: vpc id, subnet ids, security group ids, route table ids.
- `ClusterOutputs`: cluster name, endpoint, OIDC provider, node roles.
- `DataStoreOutputs`: endpoint, port, secret reference, encryption key id.

## Testing Plan

- Run `terraform fmt -check`.
- Run `terraform validate`.
- Run static analysis with tfsec or Checkov.
- Generate plans for dev and staging.
- Confirm every resource has required tags and encryption.

## Acceptance Criteria

- Infrastructure can be planned reproducibly for each environment.
- No resource requires manual console creation.
- Outputs are ready for Kubernetes and deployment phases.
- Security and cost defaults are enforced through Terraform, not tribal knowledge.

## Risks And Mitigations

- Risk: cloud spend grows unexpectedly. Mitigation: require tags, budgets, alerts, and smaller dev defaults.
- Risk: IAM becomes too broad. Mitigation: use permission boundaries and service-specific roles.
- Risk: state corruption. Mitigation: remote state locking, backups, and environment separation.

## Next Phase Handoff

Phase 4 should consume EKS, network, IAM, and data outputs to install Kubernetes platform components.

## Implemented Artifacts

- State bootstrap: `terraform/bootstrap` provisions encrypted S3 state and DynamoDB locking.
- Provider-neutral contract: `terraform/modules/provider-abstractions` and `cloud/provider-capabilities.yaml` define portable inputs and outputs.
- AWS modules: network, identity, data, Kubernetes, edge, and observability under `terraform/modules/`.
- Platform composition: `terraform/stacks/aws-platform` wires stable module contracts and outputs.
- Environment roots: isolated `local`, `dev`, `staging`, and `prod` configurations under `terraform/environments/`.
- Operations: validation and plan scripts, architecture diagram, tagging/cost policy, and Terraform runbook.
- Quality gates: recursive format, validation matrix, TFLint, Checkov, and protected manual plan workflows.
