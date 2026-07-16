# Vision

## Purpose

Contains computer vision services for OCR, architecture diagrams, whiteboards, UI screenshots, infrastructure diagrams, Kubernetes diagrams, and screen analysis.

## Owner Type

AI platform engineering.

## Conventions

- Python packages use `lattix_vision`.
- Generated Terraform, Kubernetes, or React outputs are proposals only.
- Low-confidence extraction requires human review.
- Image assets must follow workspace access and retention policies.

## Implemented Package

`lattix_vision` implements the Phase 22 computer vision surface:

- `VisionService.ingest_image` stores image assets, object refs, checksums, metadata, and workspace links.
- `preprocess_image`, `run_ocr`, and `classify_visual` create normalized image metadata, OCR blocks, and routing decisions.
- `extract_diagram_graph` emits diagram nodes, edges, groups, labels, confidence, review status, and knowledge graph facts.
- `generate_react_proposal`, `generate_terraform_proposal`, and `reconstruct_kubernetes_topology` create proposal-only artifacts with review gates.
- `understand_whiteboard`, `review_artifact`, and `export_diagram_facts` support human review and downstream knowledge export.

## Environment Variables

- `VISION_MODEL_DIR`
- `VISION_UPLOAD_BUCKET`
- `OCR_ENGINE`
- `VISION_MIN_CONFIDENCE`
- `VISION_MAX_IMAGE_MB`
- `VISION_REVIEW_REQUIRED_BELOW_CONFIDENCE`

## Future Phase Dependencies

- Phase 22 implements computer vision workflows.
- Phase 14 and Phase 27 consume reviewed visual facts.
