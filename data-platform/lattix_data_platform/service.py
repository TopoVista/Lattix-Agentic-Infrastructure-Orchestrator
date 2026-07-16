from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

from .models import (
    BackfillJob,
    BackfillRequest,
    DataQualityReport,
    Dataset,
    DatasetSpec,
    FeatureMaterializationRequest,
    FeatureView,
    IngestionJob,
    IngestionSchema,
    IngestionEvent,
    LineageRecord,
    StreamIngestionRequest,
)


@dataclass(slots=True)
class DataEngineeringPlatformService:
    datasets: dict[str, Dataset] = field(default_factory=dict)
    ingestion_jobs: dict[str, IngestionJob] = field(default_factory=dict)
    feature_views: dict[str, FeatureView] = field(default_factory=dict)
    backfill_jobs: dict[str, BackfillJob] = field(default_factory=dict)
    lineage_records: list[LineageRecord] = field(default_factory=list)

    def define_dataset(self, spec: DatasetSpec) -> Dataset:
        dataset = Dataset(
            id=str(uuid4()),
            name=spec.name,
            zone=spec.zone,
            schema=spec.schema,
            partitions=spec.partitions,
            owner=spec.owner,
            retention_days=spec.retention_days,
            quality_rules=spec.quality_rules,
        )
        self.datasets[dataset.id] = dataset
        return dataset

    def ingest_event_stream(self, request: StreamIngestionRequest) -> IngestionJob:
        dataset = self.datasets.get(request.target_dataset_id)
        if dataset is None:
            raise KeyError(f"unknown dataset {request.target_dataset_id}")

        records: list[dict[str, Any]] = []
        errors: list[str] = []
        for event in request.events:
            normalized = self._normalize_event(event, dataset.schema)
            missing = [field for field in dataset.schema.fields if field not in normalized or normalized[field] in (None, "")]
            if missing:
                errors.append(f"missing values for {', '.join(missing)}")
                continue
            records.append(normalized)

        dataset.records.extend(records)
        checkpoint = f"{request.source_topic}:{len(records)}"
        job = IngestionJob(
            id=str(uuid4()),
            source_topic=request.source_topic,
            target_dataset_id=request.target_dataset_id,
            status="completed" if not errors else "failed",
            checkpoint=checkpoint,
            lag=max(0, len(request.events) - len(records)),
            errors=errors,
        )
        self.ingestion_jobs[job.id] = job
        self._append_lineage(
            source=request.source_topic,
            transform="ingest",
            target=dataset.name,
            run_id=job.id,
            owner=dataset.owner,
        )
        return job

    def run_data_quality_checks(self, dataset_id: str) -> DataQualityReport:
        dataset = self.datasets.get(dataset_id)
        if dataset is None:
            raise KeyError(f"unknown dataset {dataset_id}")

        checks = ["completeness", "freshness", "schema"]
        failures: list[str] = []
        if not dataset.records:
            failures.append("dataset has no records")

        for field in dataset.schema.fields:
            if any(record.get(field) in (None, "") for record in dataset.records):
                failures.append(f"missing values for {field}")

        if "freshness" in dataset.quality_rules and dataset.records:
            latest = self._parse_timestamp(max(record.get("occurred_at") for record in dataset.records if record.get("occurred_at")))
            cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
            if latest < cutoff:
                failures.append("stale data: latest event is older than the freshness window")

        severity = "high" if failures else "low"
        return DataQualityReport(
            dataset_id=dataset_id,
            checks=checks,
            failures=failures,
            severity=severity,
            generated_at=datetime.now(timezone.utc).isoformat(),
        )

    def materialize_feature_view(self, request: FeatureMaterializationRequest) -> FeatureView:
        dataset = self.datasets.get(request.source_dataset_id)
        if dataset is None:
            raise KeyError(f"unknown dataset {request.source_dataset_id}")

        base_record = next(iter(dataset.records), {})
        features = {name: base_record.get(name) for name in request.feature_names if name in base_record}
        view = FeatureView(
            name=request.name,
            entity_key=request.entity_key,
            features=features,
            source_dataset_id=request.source_dataset_id,
            freshness_minutes=request.freshness_minutes,
            lineage=[
                LineageRecord(
                    source=request.source_dataset_id,
                    transform="feature-materialization",
                    target=request.name,
                    run_id=str(uuid4()),
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    owner=dataset.owner,
                )
            ],
        )
        self.feature_views[view.name] = view
        self.lineage_records.extend(view.lineage)
        return view

    def backfill_dataset(self, request: BackfillRequest) -> BackfillJob:
        job = BackfillJob(
            id=str(uuid4()),
            dataset_id=request.dataset_id,
            status="queued",
            replay_window=(request.start_time, request.end_time),
            checkpoint=f"backfill:{request.dataset_id}",
            audit=[f"replay from {request.start_time} to {request.end_time}"],
        )
        self.backfill_jobs[job.id] = job
        self._append_lineage(
            source=request.dataset_id,
            transform="backfill",
            target=request.dataset_id,
            run_id=job.id,
            owner="data-platform",
        )
        return job

    def _normalize_event(self, event: IngestionEvent, schema: IngestionSchema) -> dict[str, Any]:
        payload: dict[str, Any] = {}
        for field in schema.fields:
            value = getattr(event, field, None)
            if value is None and field in event.metadata:
                value = event.metadata[field]
            payload[field] = value
        return payload

    def _append_lineage(self, source: str, transform: str, target: str, run_id: str, owner: str) -> None:
        self.lineage_records.append(
            LineageRecord(
                source=source,
                transform=transform,
                target=target,
                run_id=run_id,
                timestamp=datetime.now(timezone.utc).isoformat(),
                owner=owner,
            )
        )

    def _parse_timestamp(self, raw: str | None) -> datetime:
        if raw is None:
            return datetime.now(timezone.utc)
        if raw.endswith("Z"):
            raw = raw[:-1] + "+00:00"
        return datetime.fromisoformat(raw)
