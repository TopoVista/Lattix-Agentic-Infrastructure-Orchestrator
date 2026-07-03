# Phase 22 - Computer Vision

## Goal

Build Lattix computer vision capabilities for architecture diagrams, OCR, whiteboards, screenshots, infrastructure diagrams, Kubernetes diagrams, and UI-to-code understanding.

## Why This Phase Exists

Engineering knowledge often exists in images: whiteboards, diagrams, screenshots, dashboards, and design files. Lattix should convert those visuals into searchable, actionable, and automatable knowledge.

## Success Criteria

- Images can be uploaded, classified, OCRed, and processed.
- Architecture and infrastructure diagrams can produce structured entities and relationships.
- UI screenshots can generate React component proposals.
- Kubernetes diagrams can be reconstructed into resource-level models.
- Outputs include confidence and human review status.

## Deliverables

- Vision service.
- Image ingestion pipeline.
- OCR module.
- Diagram parser.
- Whiteboard understanding module.
- Screenshot-to-React proposal module.
- Infrastructure-to-Terraform proposal module.
- Kubernetes diagram reconstruction module.

## Folder Structure

```text
vision/
  service/
  ingestion/
  ocr/
  diagram-understanding/
  whiteboard/
  ui-to-react/
  infra-to-terraform/
  kubernetes-reconstruction/
  models/
  evaluation/
```

## Modules To Build

- Image ingestion module.
- OCR module.
- Diagram detection module.
- Entity and relationship extraction module.
- UI component extraction module.
- Infrastructure resource extraction module.
- Kubernetes resource reconstruction module.
- Review and correction module.

## Functionality

- Accept image uploads and link them to workspace, project, repository, incident, or document.
- Run OCR and layout detection.
- Detect diagram nodes, edges, labels, icons, and groups.
- Convert diagrams into graph facts and proposal artifacts.
- Convert UI screenshots into component hierarchy and design tokens.
- Convert infrastructure diagrams into Terraform proposal drafts.
- Convert Kubernetes diagrams into manifests or topology models.

## Tech Stack

- Python.
- FastAPI.
- OpenCV.
- YOLO.
- Detectron2.
- OCR engine such as Tesseract or cloud OCR adapter.
- PyTorch.
- Object storage.
- Qdrant for visual or text embeddings when needed.

## Implementation Plan

1. Define image asset model and upload flow.
2. Implement preprocessing: resize, normalize, deskew, denoise, and format conversion.
3. Implement OCR extraction with text blocks and coordinates.
4. Implement diagram classification: architecture, infrastructure, Kubernetes, UI, whiteboard, dashboard, unknown.
5. Implement entity and relationship extraction for boxes, arrows, labels, icons, swimlanes, and groups.
6. Implement structured output schemas for diagram graphs, UI trees, Terraform proposals, and Kubernetes topology.
7. Implement human review workflow for low-confidence outputs.
8. Export reviewed facts into knowledge graph and documents.

## Functions / Classes / Interfaces To Implement

```python
def ingest_image(request: ImageIngestionRequest) -> ImageAsset:
    # Stores image, computes checksum, extracts metadata, and schedules vision processing.

def run_ocr(asset: ImageAsset) -> OcrResult:
    # Extracts text blocks, coordinates, confidence, language, and layout hints.

def classify_visual(asset: ImageAsset, ocr: OcrResult) -> VisualClassification:
    # Classifies visual type and selects the correct downstream extraction pipeline.

def extract_diagram_graph(request: DiagramExtractionRequest) -> DiagramGraph:
    # Detects nodes, edges, labels, groups, and relationships from architecture-like diagrams.

def generate_react_proposal(request: UiScreenshotRequest) -> ReactComponentProposal:
    # Converts UI screenshot structure into component hierarchy, props, and styling hints.

def generate_terraform_proposal(request: InfraDiagramRequest) -> TerraformProposal:
    # Converts infrastructure diagram entities into Terraform resources requiring human review.
```

## Configuration / Environment Variables

- `VISION_MODEL_DIR`
- `VISION_UPLOAD_BUCKET`
- `OCR_ENGINE`
- `VISION_MIN_CONFIDENCE`
- `VISION_MAX_IMAGE_MB`
- `VISION_REVIEW_REQUIRED_BELOW_CONFIDENCE`

## Data Models / Schemas / Contracts

- `ImageAsset`: id, workspaceId, objectRef, contentType, checksum, source, createdAt.
- `OcrResult`: textBlocks, language, confidence, layout, processedAt.
- `DiagramGraph`: nodes, edges, labels, groups, confidence, reviewStatus.
- `ReactComponentProposal`: componentTree, assets, styles, assumptions, confidence.
- `TerraformProposal`: resources, variables, dependencies, warnings, requiresApproval.

## Testing Plan

- Unit tests for preprocessing and schema mapping.
- OCR fixture tests on diagrams and screenshots.
- Diagram extraction tests on labeled sample images.
- UI-to-React proposal tests with human-reviewed fixtures.
- Safety tests to ensure Terraform proposals are never auto-applied.

## Acceptance Criteria

- Uploaded images produce structured outputs with confidence.
- Low-confidence outputs require review.
- Diagram facts can be exported to knowledge graph.
- Generated code or Terraform is proposal-only.

## Risks And Mitigations

- Risk: visual extraction is inaccurate. Mitigation: confidence scores, human review, and correction feedback.
- Risk: generated infrastructure is dangerous. Mitigation: proposal-only output and approval gates.
- Risk: images contain sensitive data. Mitigation: access controls, redaction, and retention policies.

## Next Phase Handoff

Phase 23 should add audio and signal processing so meetings, alarms, and speech become structured platform knowledge.
