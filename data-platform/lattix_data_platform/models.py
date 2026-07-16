from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
from uuid import uuid4


@dataclass(slots=True)
class IngestionSchema:
    fields: list[str] = field(default_factory=list)


@dataclass(slots=True)
class IngestionEvent:
    event_type: str | None = None
    repository_id: str | None = None
    incident_id: str | None = None
    deployment_id: str | None = None
    severity: str | None = None
    occurred_at: str | None = None
    duration_seconds: int | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class StreamIngestionRequest:
    source_topic: str
    target_dataset_id: str
    events: list[IngestionEvent] = field(default_factory=list)


@dataclass(slots=True)
class DatasetSpec:
    name: str
    zone: str
    schema: IngestionSchema
    partitions: list[str] = field(default_factory=list)
    owner: str = "unknown"
    retention_days: int = 30
    quality_rules: list[str] = field(default_factory=list)


@dataclass(slots=True)
class Dataset:
    id: str
    name: str
    zone: str
    schema: IngestionSchema
    partitions: list[str] = field(default_factory=list)
    owner: str = "unknown"
    retention_days: int = 30
    quality_rules: list[str] = field(default_factory=list)
    records: list[dict[str, Any]] = field(default_factory=list)


@dataclass(slots=True)
class IngestionJob:
    id: str
    source_topic: str
    target_dataset_id: str
    status: str
    checkpoint: str
    lag: int = 0
    errors: list[str] = field(default_factory=list)


@dataclass(slots=True)
class DataQualityReport:
    dataset_id: str
    checks: list[str]
    failures: list[str] = field(default_factory=list)
    severity: str = "low"
    generated_at: str = ""


@dataclass(slots=True)
class FeatureMaterializationRequest:
    name: str
    entity_key: str
    source_dataset_id: str
    freshness_minutes: int
    feature_names: list[str] = field(default_factory=list)


@dataclass(slots=True)
class LineageRecord:
    source: str
    transform: str
    target: str
    run_id: str
    timestamp: str
    owner: str


@dataclass(slots=True)
class FeatureView:
    name: str
    entity_key: str
    features: dict[str, Any] = field(default_factory=dict)
    source_dataset_id: str = ""
    freshness_minutes: int = 0
    lineage: list[LineageRecord] = field(default_factory=list)


@dataclass(slots=True)
class BackfillRequest:
    dataset_id: str
    start_time: str
    end_time: str


@dataclass(slots=True)
class BackfillJob:
    id: str
    dataset_id: str
    status: str
    replay_window: tuple[str, str]
    checkpoint: str
    audit: list[str] = field(default_factory=list)


@dataclass(slots=True)
class MemoryScope:
    user_id: str | None = None
    workspace_id: str | None = None
    repository_id: str | None = None
    project_id: str | None = None
    team_id: str | None = None
    global_scope: bool = False


@dataclass(slots=True)
class MemoryPolicy:
    scope: MemoryScope
    retention_days: int
    allowed_roles: list[str]
    redaction_rules: list[str]
    deletion_mode: str
