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

## Future Phase Dependencies

- Phase 20 provides data engineering and feature foundations.
- Phase 21 implements ML platform capabilities.
- Phase 38 consumes ML outputs for cost forecasting and anomaly detection.
