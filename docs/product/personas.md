# Lattix User Personas

## Platform Engineer

### Profile

Owns internal developer platforms, Kubernetes, Terraform modules, CI/CD templates, cloud account structure, and shared service reliability.

### Goals

- Understand service and infrastructure dependencies.
- Standardize deployment and runtime patterns.
- Reduce manual platform support work.
- Give developers safer self-service workflows.

### Pain Points

- Platform knowledge is spread across Terraform, Kubernetes, runbooks, Slack, and memory.
- Teams bypass standard deployment or cloud practices.
- Debugging platform issues requires context from many systems.
- Manual approvals and support requests do not scale.

### Lattix Value

- Cloud controllers and digital twin analysis show platform impact before changes.
- Agent workflows can propose Terraform, Kubernetes, and CI/CD improvements.
- Policy and approval gates make self-service safer.
- Observability and knowledge graph link services, owners, deployments, and incidents.

## Backend Engineer

### Profile

Builds APIs, services, events, database models, tests, and service integrations.

### Goals

- Navigate large repositories quickly.
- Understand API, database, and event impact before code changes.
- Generate safe boilerplate that follows local architecture.
- Debug failures using code, logs, metrics, traces, and deployments together.

### Pain Points

- Generic AI suggestions ignore local service patterns.
- Finding references across services is slow.
- Database and event changes have hidden consumers.
- Test and deployment failures often lack context.

### Lattix Value

- Repository intelligence provides symbols, references, call graphs, API graphs, and database graphs.
- Code completion proposes diffs grounded in existing style and contracts.
- Chat answers cite code and runtime evidence.
- CI/CD and AI review catch risk before deployment.

## Frontend Engineer

### Profile

Builds UI workflows, editor experiences, dashboards, chat interfaces, and product surfaces.

### Goals

- Build UI against stable typed contracts.
- Understand backend data shapes and permissions.
- Create workflows that show loading, error, empty, and permission states clearly.
- Use AI for component generation without losing design consistency.

### Pain Points

- Backend contracts are sometimes unclear or unstable.
- AI-generated UI often ignores existing product conventions.
- Screenshots and designs require manual translation into code.
- Debugging frontend issues requires API, auth, and trace context.

### Lattix Value

- API design and SDKs provide typed contracts.
- Vision features can turn screenshots into reviewed component proposals.
- Observability connects frontend traces to gateway and service behavior.
- Workspace UI keeps repository, docs, tasks, and chat in one place.

## DevOps Or SRE Engineer

### Profile

Owns reliability, deployments, incidents, monitoring, alerting, runbooks, and recovery.

### Goals

- Detect and recover from production issues faster.
- Understand whether deployments, cloud changes, or traffic caused an incident.
- Validate DR, chaos, and resilience assumptions.
- Keep alerts actionable and tied to ownership.

### Pain Points

- Incident context is fragmented across tools.
- Runbooks become stale.
- Alerts lack clear ownership or root cause hints.
- Deployment safety depends on manual judgment.

### Lattix Value

- Observability and knowledge graph connect alerts to services, owners, deployments, logs, and code.
- Digital twin recommends safer rollout and rollback strategies.
- Chaos and DR phases prove recovery.
- Incident response agents produce evidence-backed summaries and action items.

## Security Engineer

### Profile

Owns access control, threat modeling, vulnerability management, audit trails, secrets, runtime security, and compliance evidence.

### Goals

- Enforce least privilege across humans, services, agents, and tools.
- Prevent secret leakage and unsafe automation.
- Track vulnerabilities and policy violations.
- Produce audit evidence without manual collection.

### Pain Points

- AI and automation can bypass review if not governed.
- Secrets and tokens can appear in logs, prompts, or tool outputs.
- Vulnerability findings are noisy.
- Audit evidence is hard to collect after the fact.

### Lattix Value

- Every tool call and agent action is scoped, policy checked, redacted, and audited.
- Threat model and zero-trust policies are first-class.
- Compliance evidence is generated from real platform events.
- Privileged actions require approval and traceability.

## CTO Or Engineering Leader

### Profile

Owns engineering strategy, delivery risk, platform investment, security posture, reliability, and cost.

### Goals

- Understand system health and delivery risk.
- Reduce cycle time without compromising safety.
- See cost drivers and optimization opportunities.
- Make architectural decisions with evidence.

### Pain Points

- Reports lag reality.
- Architecture knowledge lives in people's heads.
- Cost, reliability, and delivery data are disconnected.
- AI adoption lacks governance.

### Lattix Value

- Digital twin answers high-level what-if questions with evidence.
- Cost optimization shows savings and risk.
- Compliance, audit, and readiness gates support enterprise trust.
- Agentic workflows accelerate work while preserving control.

## ML Engineer

### Profile

Builds prediction, anomaly detection, embedding, reranking, and model-serving systems.

### Goals

- Access trustworthy features and labeled datasets.
- Track experiments and model lineage.
- Serve models with monitoring and retraining triggers.
- Integrate model outputs into operational workflows.

### Pain Points

- Features are hard to reproduce.
- Model metrics are disconnected from product outcomes.
- Drift is detected late.
- Serving models safely inside engineering workflows is complex.

### Lattix Value

- Data engineering platform provides lineage and feature store foundations.
- ML platform tracks experiments, model versions, drift, and prediction outcomes.
- Models feed deployment, incident, cost, autoscaling, cache, and security predictions.

## Support Engineer

### Profile

Handles customer issues, operational questions, onboarding problems, and escalations.

### Goals

- Understand customer-impacting issues quickly.
- Find relevant docs, runbooks, incidents, and owners.
- Escalate with evidence.
- Avoid exposing sensitive data.

### Pain Points

- Customer issues require context from engineering systems.
- Support docs and runbooks can be stale.
- Escalations lack enough technical detail.
- Audit and privacy requirements are easy to miss.

### Lattix Value

- Knowledge graph links customer-visible symptoms to services, incidents, deployments, and owners.
- Chat can summarize evidence with permission filters.
- Support workflows create action items and audit trails.
- Documentation portal and onboarding plans reduce repetitive support.
