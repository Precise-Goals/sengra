#!/usr/bin/env python3
"""Path and lane guard for harness roles. Exit 0 = allowed, non-zero = violation."""
import fnmatch
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def get_allowed_paths_for_role(role_name, root=ROOT):
    role_file = root / "harness" / "roles" / f"{role_name}.md"
    if not role_file.exists():
        return []
    content = role_file.read_text(encoding="utf-8")
    m = re.search(r"^#+\s*Allowed paths\s*\n(.*?)(?=^#+\s|\Z)", content, re.M | re.S | re.I)
    if not m:
        return []
    paths = []
    for line in m.group(1).splitlines():
        line = line.strip()
        if line.startswith("-") or line.startswith("*"):
            pattern = line.lstrip("-* ").strip()
            # remove backticks if present
            pattern = pattern.strip("`")
            if pattern and not pattern.startswith("#"):
                paths.append(pattern)
    return paths


def get_lane_locks(root=ROOT):
    locks_dir = root / "harness" / "state" / "locks"
    locks = {}
    if locks_dir.exists():
        for lock_file in locks_dir.glob("*.json"):
            try:
                data = json.loads(lock_file.read_text(encoding="utf-8"))
                owner = data.get("owner", lock_file.stem)
                for path in data.get("owns", []):
                    locks[path] = owner
            except Exception:
                pass
    return locks


def is_path_allowed(file_path, allowed_patterns):
    norm_file = file_path.replace("\\", "/")
    if any(p in ("*", "**", "everything") for p in allowed_patterns):
        return True
    for pat in allowed_patterns:
        norm_pat = pat.replace("\\", "/")
        if norm_pat.endswith("/**"):
            prefix = norm_pat[:-3].rstrip("/")
            if norm_file == prefix or norm_file.startswith(prefix + "/"):
                return True
        elif norm_pat.endswith("/*"):
            prefix = norm_pat[:-2].rstrip("/")
            if norm_file.startswith(prefix + "/") and "/" not in norm_file[len(prefix) + 1 :]:
                return True
        elif fnmatch.fnmatch(norm_file, norm_pat):
            return True
        elif norm_file == norm_pat or norm_file.startswith(norm_pat.rstrip("/") + "/"):
            return True
    return False


def get_git_diff_files(root=ROOT):
    try:
        res = subprocess.run(
            ["git", "diff", "--name-only", "HEAD"],
            cwd=root,
            capture_output=True,
            text=True,
            check=True,
        )
        files = [f.strip() for f in res.stdout.splitlines() if f.strip()]
        # also include untracked if not tracked
        status = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=root,
            capture_output=True,
            text=True,
            check=True,
        )
        for line in status.stdout.splitlines():
            if line.startswith("??"):
                files.append(line[3:].strip())
        return sorted(set(files))
    except Exception:
        return []


def check_guard(role_name, files=None, root=ROOT):
    allowed_patterns = get_allowed_paths_for_role(role_name, root)
    if not allowed_patterns:
        return [f"Role '{role_name}' has no allowed paths defined or role file is missing."]

    lane_locks = get_lane_locks(root)
    for path, owner in lane_locks.items():
        if owner == role_name:
            allowed_patterns.append(path)

    if files is None:
        files = get_git_diff_files(root)

    violations = []
    for f in files:
        if not is_path_allowed(f, allowed_patterns):
            violations.append(f"Write violation: Role '{role_name}' cannot modify '{f}'")
    return violations


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Harness Path Guard")
    parser.add_argument("--role", required=True, help="Agent role name")
    parser.add_argument("--files", nargs="*", help="List of modified files to check")
    args = parser.parse_args()

    violations = check_guard(args.role, files=args.files)
    if violations:
        for v in violations:
            print(f"GUARD REJECT: {v}")
        return 1
    print(f"GUARD OK: Role '{args.role}' within allow-list.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
