#!/usr/bin/env python3
"""Circuit breaker enforcement for the harness."""
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _load_json(p):
    try:
        return json.loads(Path(p).read_text(encoding="utf-8"))
    except Exception:
        return {}


def _save_json(p, data):
    p = Path(p)
    p.parent.mkdir(parents=True, exist_ok=True)
    temp = p.with_suffix(".tmp")
    temp.write_text(json.dumps(data, indent=2), encoding="utf-8")
    temp.replace(p)


def failure_signature(test_names, error_text):
    """Deterministic hash of failure signature."""
    raw = "|".join(sorted(test_names)) + ":::" + error_text.strip()
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def record_failure(stage, reason, signature=None, root=ROOT):
    log_file = root / "harness" / "logs" / "failures.log.md"
    log_file.parent.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    entry = f"\n### F-{now} | stage={stage} | signature={signature or 'none'}\nReason: {reason}\n"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(entry)


def trip_breaker(reason, root=ROOT):
    state_file = root / "harness" / "state" / "state.json"
    state = _load_json(state_file)
    state.setdefault("breaker", {})
    state["breaker"]["tripped"] = True
    state["breaker"]["reason"] = reason
    state["breaker"]["tripped_at"] = datetime.now(timezone.utc).isoformat()
    _save_json(state_file, state)
    record_failure(state.get("current_stage", "unknown"), reason, root=root)
    print(f"CIRCUIT BREAKER TRIPPED: {reason}")
    return 1


def check_breaker_conditions(stage, attempts=1, identical_failures=0, diff_lines=0, files_count=0, root=ROOT):
    budgets_file = root / "harness" / "state" / "budgets.json"
    budgets = _load_json(budgets_file)

    max_retries = budgets.get("max_stage_retries", 3)
    if attempts > max_retries:
        return trip_breaker(f"Stage '{stage}' failed {attempts} times (> {max_retries})", root=root)

    max_ident = budgets.get("max_identical_failures", 2)
    if identical_failures >= max_ident:
        return trip_breaker(f"Identical failure signature repeated {identical_failures} times (>= {max_ident})", root=root)

    max_lines = budgets.get("max_diff_lines_per_lane", 400)
    if diff_lines > max_lines:
        return trip_breaker(f"Diff lines {diff_lines} exceeds maximum {max_lines}", root=root)

    max_files = budgets.get("max_files_per_lane", 15)
    if files_count > max_files:
        return trip_breaker(f"Modified files {files_count} exceeds maximum {max_files}", root=root)

    return 0


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "trip":
        reason = sys.argv[2] if len(sys.argv) > 2 else "Manual trip"
        return trip_breaker(reason)
    print("Breaker check OK.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
