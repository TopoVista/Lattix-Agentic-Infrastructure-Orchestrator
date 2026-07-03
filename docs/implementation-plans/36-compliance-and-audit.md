# Phase 36 - Compliance And Audit

## Goal

Make Lattix SOC2/GDPR-ready by implementing compliance evidence, audit trails, retention, privacy controls, data subject workflows, and enterprise reporting.

## Why This Phase Exists

Enterprise customers need proof that the platform is secure, governed, reliable, and privacy-aware. Compliance should emerge from real platform telemetry and controls, not manual spreadsheet work.

## Success Criteria

- Audit trails exist for user, service, agent, tool, cloud, deployment, data, secret, and admin actions.
- Evidence collection maps controls to system events and artifacts.
- Retention and deletion policies are enforceable.
- GDPR-style data subject workflows are defined.
- Compliance dashboards and export reports exist.

## Deliverables

- Control catalog.
- Audit event schema.
- Evidence collection service.
- Retention policy engine.
- Data subject request workflow.
- Compliance dashboards.
- Audit export package.

## Folder Structure

```text
compliance/
  controls/
  audit/
  evidence/
  retention/
  privacy/
  reports/
security/
  audit/
docs/
  compliance/
```

## Modules To Build

- Audit trail module.
- Control mapping module.
- Evidence collector module.
- Retention policy module.
- Privacy request module.
- Compliance reporting module.
- Audit export module.

## Functionality

- Record immutable audit events for important actions.
- Map audit events, CI results, security scans, approvals, incidents, backups, and access reviews to controls.
- Enforce retention by data class and tenant policy.
- Support data access, deletion, export, and correction workflows.
- Generate reports for auditors and enterprise customers.
- Detect missing evidence or control drift.

## Tech Stack

- PostgreSQL or append-only audit store.
- Object storage for evidence artifacts.
- Kafka audit event stream.
- OpenSearch for audit search.
- Policy engine for retention.
- Dashboard tooling.

## Implementation Plan

1. Define control catalog for SOC2-ready architecture and GDPR-relevant workflows.
2. Define audit event schema and required event sources.
3. Implement append-only audit ingestion and search.
4. Implement evidence collector that links events and artifacts to controls.
5. Implement retention policy engine by data class, tenant, source, and legal hold.
6. Implement data subject request workflows for export, deletion, correction, and access.
7. Add compliance dashboards for evidence freshness, control status, access reviews, and retention jobs.
8. Add audit export packages with checksums and metadata.

## Functions / Classes / Interfaces To Implement

```python
def record_audit_event(event: AuditEvent) -> AuditRecord:
    # Stores immutable audit event with actor, action, resource, decision, trace, and evidence references.

def collect_control_evidence(request: EvidenceCollectionRequest) -> EvidencePackage:
    # Maps system events and artifacts to compliance controls with freshness and owner metadata.

def enforce_retention_policy(request: RetentionRequest) -> RetentionResult:
    # Deletes, archives, or preserves data according to class, tenant policy, and legal hold.

def process_data_subject_request(request: DataSubjectRequest) -> DataSubjectRequestResult:
    # Executes access, export, deletion, or correction workflow with approval and evidence.

def generate_audit_export(request: AuditExportRequest) -> AuditExportPackage:
    # Produces tamper-evident export of audit events, evidence, and metadata for a period.
```

## Configuration / Environment Variables

- `AUDIT_STORE_URL`
- `AUDIT_RETENTION_DAYS`
- `EVIDENCE_BUCKET`
- `RETENTION_POLICY_MODE`
- `DATA_SUBJECT_REQUEST_ENABLED`
- `AUDIT_EXPORT_SIGNING_KEY`
- `LEGAL_HOLD_ENABLED`

## Data Models / Schemas / Contracts

- `AuditEvent`: actor, action, resource, decision, workspaceId, traceId, timestamp, evidence.
- `Control`: id, framework, description, owner, evidenceSources, frequency.
- `EvidencePackage`: controlId, artifacts, events, freshness, status, generatedAt.
- `RetentionPolicy`: dataClass, duration, action, exceptions, legalHold.
- `DataSubjectRequest`: subjectId, type, scope, status, approvals, evidence.

## Testing Plan

- Audit event immutability tests.
- Evidence mapping tests for representative controls.
- Retention policy tests with archive, delete, and legal hold cases.
- Data subject workflow tests.
- Audit export integrity tests.

## Acceptance Criteria

- Critical actions are audit logged.
- Evidence can be generated from real platform activity.
- Retention and privacy workflows are enforceable.
- Audit exports are complete and tamper-evident.

## Risks And Mitigations

- Risk: audit data grows quickly. Mitigation: partitioning, retention, compression, and export tiers.
- Risk: deletion conflicts with audit retention. Mitigation: legal basis, redaction, and legal hold policies.
- Risk: evidence is incomplete. Mitigation: control coverage dashboards and missing-evidence alerts.

## Next Phase Handoff

Phase 37 should prove performance and capacity through repeatable benchmarking.
