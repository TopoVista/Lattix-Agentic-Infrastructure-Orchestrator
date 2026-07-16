# Computer Vision — Developer Guide

> Diagram understanding, screenshot analysis, OCR, whiteboard digitization, and UI-to-code conversion.

## Overview (Phase 22)

The Vision module uses OpenCV, YOLO, and Detectron2 to understand architectural diagrams, screenshots, whiteboards, and UI mockups.

## Capabilities

### 1. Architecture Diagram Parser

Converts PNG/SVG architecture diagrams into a component graph JSON.

```python
from lattix_vision import DiagramParser

parser = DiagramParser()

# Parse a system architecture diagram
result = parser.parse("docs/architecture/system-context.png")

print(f"Detected components: {len(result.components)}")
for comp in result.components:
    print(f"  {comp.label} ({comp.type}) at ({comp.x}, {comp.y})")

print(f"Detected connections: {len(result.connections)}")
for conn in result.connections:
    print(f"  {conn.source} → {conn.target} [{conn.label}]")

# Export as JSON
result.to_json("output/diagram-graph.json")

# Export as Mermaid
print(result.to_mermaid())
```

### 2. Screenshot → UI Code

Converts a screenshot of a UI into React or HTML code.

```python
from lattix_vision import UICodeGenerator

generator = UICodeGenerator()

code = generator.from_screenshot(
    image_path="screenshots/dashboard.png",
    target_framework="react",  # or "html", "vue", "svelte"
    style="tailwind"           # or "css", "styled-components"
)

print(code.component_code)
print(f"Confidence: {code.confidence:.0%}")
```

### 3. OCR Document Extraction

Extracts structured text from PDFs and images.

```python
from lattix_vision import OCRExtractor

ocr = OCRExtractor()

# Extract from PDF
result = ocr.extract("docs/requirements/prd.pdf")
print(f"Pages: {result.page_count}")
print(f"Text: {result.full_text[:500]}")
print(f"Tables: {len(result.tables)}")

# Extract structured data
for table in result.tables:
    print(table.to_dataframe())
```

### 4. Whiteboard Digitizer

Converts a whiteboard photo into a clean diagram.

```python
from lattix_vision import WhiteboardDigitizer

wb = WhiteboardDigitizer()
result = wb.digitize("photos/whiteboard-session.jpg")

print(result.mermaid_diagram)
print(f"Detected shapes: {result.shape_count}")
print(f"Detected text: {result.text_regions}")
```

## Running Tests

```bash
python -m pytest vision/ -v
```

## Dependencies

```
OpenCV 4.x          - Image processing
YOLO v8             - Object detection
Detectron2          - Instance segmentation
pytesseract         - OCR engine
Pillow              - Image manipulation
```
