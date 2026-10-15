import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
import guard_paths as gp


def test_guard_paths_allow_list(tmp_path):
    (tmp_path / "harness/roles").mkdir(parents=True)
    role_content = """# Builder Role
## Purpose
Building stuff.
## Allowed paths
- packages/tools/**
- apps/web/**
- harness/artifacts/**
"""
    (tmp_path / "harness/roles/builder.md").write_text(role_content, encoding="utf-8")
    allowed = gp.get_allowed_paths_for_role("builder", root=tmp_path)
    assert "packages/tools/**" in allowed

    violations = gp.check_guard(
        "builder",
        files=["packages/tools/index.js", "apps/web/src/app/page.jsx", "unauthorized.txt"],
        root=tmp_path,
    )
    assert len(violations) == 1
    assert "unauthorized.txt" in violations[0]


def test_guard_paths_allows_valid_files(tmp_path):
    (tmp_path / "harness/roles").mkdir(parents=True)
    role_content = """# Test Author Role
## Allowed paths
- tests/**
- harness/artifacts/**
"""
    (tmp_path / "harness/roles/test-author.md").write_text(role_content, encoding="utf-8")
    violations = gp.check_guard(
        "test-author",
        files=["tests/unit/test_algo.js", "harness/artifacts/T-0001/04-tests.md"],
        root=tmp_path,
    )
    assert violations == []
