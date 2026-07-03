# Phase 39 - Documentation Portal SDKs CLI

## Goal

Build the Lattix documentation portal, SDKs, CLI, examples, and versioned public interfaces for developers and enterprise customers.

## Why This Phase Exists

An enterprise platform needs a professional developer experience outside the main UI. Docs, SDKs, and CLI make Lattix understandable, automatable, scriptable, and easier to integrate into customer workflows.

## Success Criteria

- Documentation portal covers concepts, quickstarts, APIs, events, SDKs, CLI, integrations, security, operations, and runbooks.
- SDKs expose typed clients for core platform APIs.
- CLI supports auth, workspace, repository, agent, pipeline, cloud, docs, and admin workflows.
- API, event, and SDK versions are documented.
- Examples and tutorials are tested.

## Deliverables

- Documentation portal.
- OpenAPI and AsyncAPI published docs.
- TypeScript SDK.
- Java SDK.
- Python SDK.
- CLI.
- Examples repository or examples folder.
- Release and versioning policy.

## Folder Structure

```text
docs-portal/
  app/
  content/
    concepts/
    quickstarts/
    api/
    events/
    sdk/
    cli/
    integrations/
    security/
    operations/
sdk/
  typescript/
  java/
  python/
cli/
  src/
examples/
```

## Modules To Build

- Documentation portal module.
- API reference module.
- SDK generation module.
- TypeScript SDK module.
- Java SDK module.
- Python SDK module.
- CLI auth module.
- CLI command modules.
- Example validation module.

## Functionality

- Publish conceptual docs and task-based guides.
- Generate API docs from OpenAPI and event docs from AsyncAPI.
- Provide typed SDK clients for auth, workspaces, repositories, agents, chat, pipelines, cloud, observability, and digital twin.
- Provide CLI commands for login, workspace select, repository index, chat, agent task, pipeline status, cloud plan, docs search, and admin audit export.
- Version SDKs and CLI with semantic versioning.
- Test examples in CI.

## Tech Stack

- Next.js or documentation framework.
- MDX.
- OpenAPI.
- AsyncAPI.
- TypeScript.
- Java.
- Python.
- Node or Go for CLI depending on distribution goals.
- GitHub Actions for docs and example validation.

## Implementation Plan

1. Define documentation information architecture.
2. Build docs portal with search, navigation, version switcher, and code examples.
3. Publish API and event references from source contracts.
4. Implement SDK generation or hand-written typed clients with shared contract tests.
5. Implement CLI auth and config profiles.
6. Add CLI commands for core workflows.
7. Add examples for repository onboarding, chat, agent task, pipeline run, cloud plan, and digital twin scenario.
8. Add docs link checking, API reference generation, SDK tests, CLI tests, and example tests to CI.
9. Define release, deprecation, and compatibility policy.

## Functions / Classes / Interfaces To Implement

```ts
createLattixClient(config: LattixClientConfig): LattixClient
// Creates typed SDK client with auth, retries, tracing, pagination, and error mapping.

client.agents.createTask(input: CreateAgentTaskRequest): Promise<AgentTask>
// Starts an agent task through the public API and returns task metadata.

client.digitalTwin.simulate(input: ScenarioRequest): Promise<SimulationResult>
// Runs a digital twin scenario and returns evidence-backed result.

runCliCommand(argv: string[]): Promise<CliResult>
// Parses CLI args, loads profile, executes command, and formats output.

generateApiReference(input: ApiReferenceInput): ApiReferenceBuild
// Builds versioned API and event reference docs from OpenAPI and AsyncAPI contracts.
```

## Configuration / Environment Variables

- `DOCS_PORTAL_BASE_URL`
- `DOCS_SEARCH_INDEX_URL`
- `SDK_GENERATION_ENABLED`
- `CLI_CONFIG_DIR`
- `LATTIX_API_BASE_URL`
- `LATTIX_PROFILE`
- `DOCS_VERSION`

## Data Models / Schemas / Contracts

- `LattixClientConfig`: baseUrl, tokenProvider, timeout, retries, telemetry.
- `CliProfile`: name, apiBaseUrl, workspaceId, authRef, outputFormat.
- `ApiReferenceBuild`: version, sourceContracts, pages, warnings, generatedAt.
- `ExampleScenario`: name, language, requiredServices, steps, assertions.
- `SdkRelease`: language, version, apiVersion, changelog, compatibility.

## Testing Plan

- Docs build and link tests.
- API and event reference generation tests.
- SDK contract tests against mock server.
- CLI command tests for auth, workspace, repository, agent, pipeline, cloud, and audit flows.
- Example smoke tests.

## Acceptance Criteria

- Developers can learn and use Lattix from docs alone.
- SDKs and CLI use versioned public contracts.
- Examples run successfully in CI.
- Breaking changes are documented and versioned.

## Risks And Mitigations

- Risk: docs drift from APIs. Mitigation: generate references from contracts and test examples.
- Risk: SDK behavior differs by language. Mitigation: shared contract tests and compatibility matrix.
- Risk: CLI exposes dangerous commands. Mitigation: same approval and policy model as API.

## Next Phase Handoff

Phase 40 should complete final enterprise production readiness gates before launch.
