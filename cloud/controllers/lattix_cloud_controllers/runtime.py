from __future__ import annotations

import hashlib
import os
from datetime import UTC, datetime
from typing import Any


def now_iso() -> str:
    return datetime.now(UTC).isoformat()


def stable_id(prefix: str, raw: str) -> str:
    digest = hashlib.sha1(raw.encode("utf-8")).hexdigest()[:12]
    return f"{prefix}-{digest}"


def env_flag(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.lower() in {"1", "true", "yes", "on"}


def env_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    return default if raw is None else float(raw)


def deep_diff(desired: dict[str, Any], actual: dict[str, Any], prefix: str = "") -> list[dict[str, Any]]:
    drift: list[dict[str, Any]] = []
    keys = sorted(set(desired) | set(actual))
    for key in keys:
        path = f"{prefix}.{key}" if prefix else key
        desired_value = desired.get(key)
        actual_value = actual.get(key)
        if isinstance(desired_value, dict) and isinstance(actual_value, dict):
            drift.extend(deep_diff(desired_value, actual_value, path))
        elif desired_value != actual_value:
            drift.append({"path": path, "desired": desired_value, "actual": actual_value})
    return drift
