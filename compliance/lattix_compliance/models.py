from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class AuditEvent(BaseModel):
    actor: str
    action: str
    resource: str
    decision: str
    workspace_id: str
    trace_id: str
    timestamp: datetime
    evidence: List[str]

class Control(BaseModel):
    id: str
    framework: str
    description: str
    owner: str
    evidence_sources: List[str]
    frequency: str

class EvidencePackage(BaseModel):
    control_id: str
    artifacts: List[str]
    events: List[AuditEvent]
    freshness: str
    status: str
    generated_at: datetime

class RetentionPolicy(BaseModel):
    data_class: str
    duration_days: int
    action: str
    exceptions: List[str]
    legal_hold: bool

class DataSubjectRequest(BaseModel):
    subject_id: str
    request_type: str
    scope: str
    status: str
    approvals: List[str]
    evidence: List[str]

class DataSubjectRequestResult(BaseModel):
    request_id: str
    status: str
    completed_at: datetime

class AuditRecord(BaseModel):
    id: str
    event: AuditEvent
    sealed_at: datetime

class EvidenceCollectionRequest(BaseModel):
    control_id: str

class RetentionRequest(BaseModel):
    target_data_class: str

class RetentionResult(BaseModel):
    status: str
    items_processed: int
    bytes_freed: int

class AuditExportRequest(BaseModel):
    start_date: datetime
    end_date: datetime

class AuditExportPackage(BaseModel):
    export_url: str
    checksum: str
    record_count: int
