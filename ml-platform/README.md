# ML Platform — Developer Guide

> Predictive models, MLflow experiment tracking, training pipelines, evaluation, and serving.

## Overview (Phase 21)

The ML Platform manages the complete ML lifecycle: data preparation, training, evaluation, registry, and serving.

## Model Registry

All models are registered in MLflow and tracked by name, version, and stage.

### Registered Models

| Model | Framework | Stage | Use Case |
|-------|-----------|-------|---------|
| `code-quality-classifier` | PyTorch | Production | Detect code quality issues |
| `infra-anomaly-detector` | scikit-learn | Production | Detect infrastructure anomalies |
| `cost-forecaster` | Prophet | Production | Predict monthly costs |
| `incident-classifier` | HuggingFace | Staging | Classify incident severity |
| `pr-review-ranker` | PyTorch | Production | Rank PR changes by risk |

### Python Usage

```python
import mlflow
from lattix_ml_platform import ModelRegistry, TrainingPipeline, ModelServer

# --- Experiment Tracking ---
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("code-quality-classifier")

with mlflow.start_run():
    mlflow.log_param("learning_rate", 1e-4)
    mlflow.log_param("epochs", 50)
    mlflow.log_param("batch_size", 32)
    
    # ... training loop ...
    
    mlflow.log_metric("accuracy", 0.942)
    mlflow.log_metric("f1_score", 0.937)
    mlflow.pytorch.log_model(model, "model")

# --- Model Registry ---
registry = ModelRegistry()

# Register a new version
version = registry.register(
    model_name="code-quality-classifier",
    run_id="abc123",
    description="Retrained on 2026 codebase"
)

# Promote to production
registry.transition(
    model_name="code-quality-classifier",
    version=version,
    stage="Production"
)

# --- Serving ---
server = ModelServer()
prediction = server.predict(
    model_name="code-quality-classifier",
    input_data={
        "code_snippet": "function foo() { var x = 1; return x; }",
        "language": "javascript"
    }
)
print(f"Quality score: {prediction.score}")
print(f"Issues: {prediction.issues}")
```

## Training Pipelines

```python
from lattix_ml_platform import TrainingPipeline

pipeline = TrainingPipeline(
    name="code-quality-retrain",
    model="code-quality-classifier",
    data_source="feature-store:code-quality-features",
    schedule="0 2 * * 1"  # Weekly Mondays at 2am
)

# Run manually
result = pipeline.run()
print(f"New accuracy: {result.metrics['accuracy']}")
print(f"Promoted: {result.promoted_to_production}")
```

## Evaluation Framework

```python
from lattix_ml_platform import ModelEvaluator

evaluator = ModelEvaluator()

report = evaluator.evaluate(
    model_name="code-quality-classifier",
    test_dataset="code-quality-test-2026",
    metrics=["accuracy", "precision", "recall", "f1", "latency_p99"]
)

print(f"Accuracy: {report.accuracy:.3f}")
print(f"P99 latency: {report.latency_p99_ms}ms")
print(f"Regression detected: {report.has_regression}")
```

## Service URLs (full stack)

| Service | URL | Purpose |
|---------|-----|---------|
| MLflow UI | http://localhost:5000 | Experiment tracking |
| Model Server | http://localhost:8095 | Serving API |
