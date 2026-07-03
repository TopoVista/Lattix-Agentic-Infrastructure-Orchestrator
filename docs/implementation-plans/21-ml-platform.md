# Phase 21 - ML Platform

## Goal

Build the Lattix ML platform for training, evaluating, versioning, serving, and monitoring predictive models.

## Why This Phase Exists

Lattix needs predictive intelligence for deployment failures, incidents, log anomalies, cost, API failures, resource forecasting, autoscaling, cache decisions, security threats, retrieval reranking, and code embeddings. A managed ML platform prevents one-off notebooks from becoming production dependencies.

## Success Criteria

- MLflow tracks experiments, models, metrics, artifacts, and deployments.
- Training pipelines consume feature store and lakehouse data.
- Model registry supports staging and production lifecycle.
- Serving APIs expose predictions with confidence and explanations where possible.
- Monitoring tracks drift, performance, latency, and data quality.

## Deliverables

- ML training pipeline templates.
- MLflow tracking and registry.
- Feature ingestion contracts.
- Model serving service.
- Evaluation dashboards.
- Monitoring and retraining triggers.

## Folder Structure

```text
ml-platform/
  training/
    deployment-failure/
    incident-prediction/
    log-anomaly/
    cost-prediction/
    api-failure/
    resource-forecasting/
    autoscaling/
    cache-prediction/
    security-threat/
    retrieval-reranking/
    code-embeddings/
  serving/
  registry/
  evaluation/
  monitoring/
  notebooks/
```

## Modules To Build

- Training pipeline module.
- Feature loading module.
- Model registry module.
- Model serving module.
- Evaluation module.
- Drift monitoring module.
- Batch prediction module.
- Online prediction module.

## Functionality

- Train models for deployment failure prediction, incident prediction, log anomaly detection, cost prediction, API failure prediction, resource forecasting, autoscaling prediction, cache prediction, security threat detection, retrieval reranking, and code embeddings.
- Register models with metadata, dataset lineage, metrics, and approval status.
- Serve predictions through APIs.
- Emit prediction events for audit and feedback.
- Monitor model drift and trigger retraining workflows.

## Tech Stack

- Python.
- PyTorch.
- Hugging Face.
- scikit-learn where appropriate.
- MLflow.
- Airflow.
- Feature store from phase 20.
- FastAPI model serving.
- Prometheus metrics.

## Implementation Plan

1. Define model use case registry and model card template.
2. Create training pipeline template with feature loading, train/validation split, metrics, artifacts, and MLflow logging.
3. Implement first baseline models for deployment failure, incident prediction, and log anomaly detection.
4. Define model registry promotion gates.
5. Implement serving API with prediction, batch prediction, model metadata, and health endpoints.
6. Add feedback capture for predictions and outcomes.
7. Add drift, latency, error, and accuracy monitoring.
8. Add retraining DAG templates.

## Functions / Classes / Interfaces To Implement

```python
def train_model(request: TrainingRequest) -> TrainingRun:
    # Loads features, trains model, evaluates metrics, logs artifacts, and registers candidate model.

def evaluate_model(request: EvaluationRequest) -> EvaluationReport:
    # Computes accuracy, precision, recall, calibration, drift, fairness where relevant, and baseline comparison.

def register_model_candidate(run: TrainingRun) -> ModelVersion:
    # Stores model artifact, metrics, lineage, owner, approval status, and deployment constraints.

def predict(request: PredictionRequest) -> PredictionResult:
    # Runs online prediction with model version, features, confidence, explanation, and trace metadata.

def monitor_model(model_id: str) -> ModelMonitoringReport:
    # Reports latency, errors, data drift, prediction drift, and outcome quality.
```

## Configuration / Environment Variables

- `MLFLOW_TRACKING_URI`
- `MLFLOW_ARTIFACT_BUCKET`
- `MODEL_SERVING_PORT`
- `FEATURE_STORE_OFFLINE_URL`
- `FEATURE_STORE_ONLINE_URL`
- `MODEL_REGISTRY_APPROVAL_REQUIRED`
- `MODEL_DEFAULT_DEVICE`

## Data Models / Schemas / Contracts

- `ModelUseCase`: name, objective, features, label, metric, owner, riskLevel.
- `TrainingRun`: id, useCase, datasetVersion, metrics, artifacts, status.
- `ModelVersion`: modelId, version, runId, stage, metrics, lineage, approvedBy.
- `PredictionRequest`: modelId, entityId, features, context, explain.
- `PredictionResult`: prediction, confidence, explanation, modelVersion, traceId.

## Testing Plan

- Unit tests for feature loading and metric calculation.
- Training smoke tests on fixture datasets.
- Model serving contract tests.
- Registry promotion tests.
- Drift monitoring tests with synthetic distribution changes.

## Acceptance Criteria

- At least baseline models can be trained and registered.
- Predictions are served through stable APIs with model metadata.
- Model lineage ties predictions to features and datasets.
- Monitoring can identify drift and serving failures.

## Risks And Mitigations

- Risk: models are treated as magic. Mitigation: model cards, metrics, explanations, and baselines.
- Risk: stale models keep serving. Mitigation: drift monitoring and retraining triggers.
- Risk: bad data creates bad predictions. Mitigation: feature lineage and data quality gates.

## Next Phase Handoff

Phase 22 should add computer vision models and pipelines for diagrams, OCR, screenshots, and UI-to-code analysis.
