# ML Platform

## Purpose

Contains ML training, evaluation, model registry, serving, monitoring, prediction, and drift detection assets.

## Owner Type

ML platform engineering.

## Conventions

- Python packages use `lattix_ml_<module>`.
- Models must include model cards, dataset lineage, evaluation metrics, and owner metadata.
- Online predictions must include model version and trace context.
- Production model promotion requires explicit approval and monitoring.

## Implemented Package

`lattix_ml_platform` implements the Phase 21 platform surface:

- `MLPlatformService.train_model` loads features, trains deterministic baseline models, evaluates metrics, creates model cards, logs MLflow-style artifact URIs, and registers candidates.
- `ModelRegistry` stores versions, artifacts, lineage, promotion gates, approval state, and active stages.
- `ModelServingFacade` exposes health, model metadata, prediction, batch prediction, feedback, and Prometheus metrics contracts.
- `monitor_model` reports latency, errors, data drift, prediction drift, outcome quality, data quality failures, and retraining triggers.
- `build_retraining_dag_template` emits Airflow DAG source for scheduled or triggered retraining.

## Environment Variables

- `MLFLOW_TRACKING_URI`
- `MLFLOW_ARTIFACT_BUCKET`
- `MODEL_SERVING_PORT`
- `FEATURE_STORE_OFFLINE_URL`
- `FEATURE_STORE_ONLINE_URL`
- `MODEL_REGISTRY_APPROVAL_REQUIRED`
- `MODEL_DEFAULT_DEVICE`

## Future Phase Dependencies

- Phase 20 provides data engineering and feature foundations.
- Phase 21 implements ML platform capabilities.
- Phase 38 consumes ML outputs for cost forecasting and anomaly detection.
