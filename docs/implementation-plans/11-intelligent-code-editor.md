# Phase 11 - Intelligent Code Editor

## Goal

Build the Lattix intelligent code editor using Monaco, Tree-sitter, semantic navigation, diagnostics, and AI-ready editor surfaces.

## Why This Phase Exists

The editor is the daily working surface for developers. It must understand code structure before AI suggestions, refactoring, repository intelligence, and generated changes can be trusted. This phase adds rich editing and code comprehension foundations.

## Success Criteria

- Monaco editor renders files with language-aware behavior.
- Tree-sitter parsing is available for supported languages.
- AST viewer, symbol search, references, rename flow, call graph view, dependency graph view, diagnostics, autocomplete shell, AI suggestions shell, and inline explanations are planned and integrated.
- Editor actions are permission-aware and auditable.

## Deliverables

- Monaco editor integration.
- Tree-sitter parser service contract.
- AST viewer.
- Symbol and reference search UI.
- Rename flow.
- Diagnostics panel.
- Call graph and dependency graph panels.
- AI suggestion and inline explanation surfaces.

## Folder Structure

```text
frontend/apps/web/components/editor/
  code-editor.tsx
  editor-toolbar.tsx
  ast-viewer.tsx
  symbol-search.tsx
  reference-panel.tsx
  diagnostics-panel.tsx
  graph-panel.tsx
  ai-suggestions.tsx
ai-platform/
  code-analysis/
    parser-service/
shared/
  code-intelligence/
```

## Modules To Build

- Editor shell module.
- Parser adapter module.
- AST viewer module.
- Symbol index client module.
- Reference search module.
- Rename operation module.
- Diagnostics module.
- Graph visualization module.
- AI assistance module.

## Functionality

- Open files from repository workspace into tabs.
- Parse code incrementally and display syntax structure.
- Show semantic symbols, definitions, references, and diagnostics.
- Preview rename operations before applying changes.
- Show call graph and dependency graph from repository intelligence APIs.
- Display AI suggestions as non-destructive proposals.
- Display inline explanations tied to selected code ranges.

## Tech Stack

- Monaco Editor.
- Tree-sitter.
- TypeScript.
- Web workers for editor parsing and heavy client tasks.
- FastAPI or Spring service for server-side code intelligence.
- Graph rendering through React Flow or Cytoscape.

## Implementation Plan

1. Integrate Monaco into repository file view.
2. Add editor tab, file status, language detection, and read-only/editable modes.
3. Add Tree-sitter parser adapter and supported language registry.
4. Add AST viewer that updates from current file parse tree.
5. Add symbol search and reference panels backed by repository intelligence contracts.
6. Add diagnostics panel with severity, location, source, and quick action placeholders.
7. Add rename preview flow with changed file list and diff preview.
8. Add graph panel for call and dependency graph queries.
9. Add AI suggestion and explanation UI with accept, reject, and explain controls.
10. Add telemetry and audit for editor actions that change code.

## Functions / Classes / Interfaces To Implement

```ts
openEditorFile(input: OpenEditorFileRequest): Promise<EditorFile>
// Loads content, metadata, language, permissions, and current repository revision.

parseIncrementally(input: ParseRequest): Promise<ParseTreeSnapshot>
// Produces an AST snapshot from file content and previous parse state when available.

findSymbols(input: SymbolSearchRequest): Promise<CodeSymbol[]>
// Searches repository symbols by name, kind, language, path, and workspace.

previewRename(input: RenamePreviewRequest): Promise<RenamePreview>
// Calculates affected files, edits, conflicts, and confidence before applying rename.

requestInlineExplanation(input: ExplainCodeRequest): Promise<InlineExplanation>
// Sends selected code, surrounding context, and repository metadata to the AI pipeline.
```

## Configuration / Environment Variables

- `NEXT_PUBLIC_EDITOR_MAX_FILE_BYTES`
- `NEXT_PUBLIC_CODE_INTELLIGENCE_API_URL`
- `TREE_SITTER_LANGUAGES`
- `EDITOR_AI_SUGGESTIONS_ENABLED`

## Data Models / Schemas / Contracts

- `EditorFile`: path, content, language, revision, permissions, sizeBytes.
- `ParseTreeSnapshot`: fileId, revision, rootNode, errors, durationMs.
- `CodeSymbol`: name, kind, path, range, signature, container.
- `RenamePreview`: edits, conflicts, affectedSymbols, confidence, warnings.
- `Diagnostic`: severity, message, source, path, range, code.

## Testing Plan

- Component tests for editor rendering, toolbar actions, panels, and empty states.
- Parser tests with supported language fixtures.
- Integration tests for symbol search and diagnostics contracts.
- Rename preview tests with conflict cases.
- Browser verification for large files, small screens, and tab switching.

## Acceptance Criteria

- Users can open code files in Monaco and inspect structure.
- Parser errors are visible but do not break the editor.
- AI suggestions remain proposals until explicitly accepted.
- Rename and editing actions are auditable and reversible by design.

## Risks And Mitigations

- Risk: browser parsing is too heavy. Mitigation: use web workers and server-side analysis for large files.
- Risk: AI suggestions feel unsafe. Mitigation: require preview, diff, confidence, and explicit acceptance.
- Risk: rename touches wrong files. Mitigation: preview conflicts and rely on repository index.

## Next Phase Handoff

Phase 12 should build the repository intelligence backend that powers symbols, references, graphs, diagnostics, and AI context.
