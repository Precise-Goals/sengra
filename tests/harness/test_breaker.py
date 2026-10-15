import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import breaker as br


def test_breaker_trip(tmp_path):
    (tmp_path / "harness/state").mkdir(parents=True)
    state = {"harness_version": "1", "current_stage": "build", "breaker": {"tripped": False}}
    (tmp_path / "harness/state/state.json").write_text(json.dumps(state), encoding="utf-8")

    br.trip_breaker("Test trip condition", root=tmp_path)

    updated_state = json.loads((tmp_path / "harness/state/state.json").read_text(encoding="utf-8"))
    assert updated_state["breaker"]["tripped"] is True
    assert "Test trip condition" in updated_state["breaker"]["reason"]

    failures_log = (tmp_path / "harness/logs/failures.log.md").read_text(encoding="utf-8")
    assert "Test trip condition" in failures_log


def test_failure_signature():
    sig1 = br.failure_signature(["test_a", "test_b"], "AssertionError: expected 1 got 2")
    sig2 = br.failure_signature(["test_b", "test_a"], "AssertionError: expected 1 got 2")
    sig3 = br.failure_signature(["test_a"], "AssertionError: expected 1 got 2")
    assert sig1 == sig2
    assert sig1 != sig3


def test_breaker_conditions_check(tmp_path):
    (tmp_path / "harness/state").mkdir(parents=True)
    budgets = {
        "max_stage_retries": 3,
        "max_identical_failures": 2,
        "max_diff_lines_per_lane": 400,
        "max_files_per_lane": 15,
    }
    (tmp_path / "harness/state/budgets.json").write_text(json.dumps(budgets), encoding="utf-8")
    state = {"current_stage": "build", "breaker": {"tripped": False}}
    (tmp_path / "harness/state/state.json").write_text(json.dumps(state), encoding="utf-8")

    # Under budget
    res = br.check_breaker_conditions("build", attempts=2, identical_failures=1, diff_lines=100, files_count=5, root=tmp_path)
    assert res == 0

    # Over retry budget
    res = br.check_breaker_conditions("build", attempts=4, root=tmp_path)
    assert res == 1
