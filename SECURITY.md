# Security Policy

## Supported Scope

This repository is in early implementation. Security work is still governed by the Phase 00 threat model and the Phase 35 security hardening plan.

Security-sensitive areas include:

- Authentication, authorization, sessions, tokens, and MFA.
- Secrets and credential references.
- Agent actions, tool calls, approvals, and cloud controllers.
- Repository ingestion and AI context handling.
- CI/CD, deployment, Terraform, Kubernetes, and cloud automation.
- Audit, compliance, retention, and data export workflows.

## Reporting Security Issues

Do not create public issues for vulnerabilities, secrets, tokens, private keys, exploit paths, or sensitive customer data.

Report security concerns privately to the repository owner or maintainer team. Include:

- Affected component or file.
- Impact and severity estimate.
- Reproduction steps if safe.
- Evidence without exposing secrets.
- Suggested mitigation if known.

## Secret Handling

- Never commit real secrets, tokens, private keys, cloud credentials, `.env` files, kubeconfigs, or Terraform state.
- Use secret references in documentation and code examples.
- Redact secrets before logs, prompts, search indexes, memory, analytics, and audit exports.
- Agents must never receive raw credentials.

## Approval-Gated Actions

The following action classes require policy checks and usually human approval:

- Production deployments.
- Terraform apply or destroy.
- Cloud resource delete or privilege changes.
- Kubernetes destructive actions.
- Secret read, rotate, or export.
- Cross-tenant data access.
- Large cost-impacting AI or cloud operations.

## Baseline Controls

- Enforce least privilege for humans, services, agents, and tools.
- Preserve trace and audit context across HTTP, events, agents, and tools.
- Treat repository files, documents, chat messages, and tool outputs as untrusted input.
- Use structured redaction for logs and AI prompts.
- Keep source-of-truth records distinct from rebuildable derived indexes.
