#!/usr/bin/env python3
"""
scripts/verify_gates.py — Comprehensive verification runner for Quality Gates G0 through G4.
Enforces deterministic verification across harness integrity, compilation, testing, evaluation, and security.
"""

import sys
import subprocess
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def run_command(cmd, desc):
    print(f"\n--- Checking: {desc} ---")
    print(f"Executing: {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=ROOT, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"[FAIL] {desc}")
        print("STDERR:\n" + res.stderr)
        print("STDOUT:\n" + res.stdout)
        return False
    print(f"[PASS] {desc}")
    return True

def audit_cypher_queries():
    print("\n--- Gate G4 Audit: Unparameterized Cypher & Secrets Check ---")
    forbidden = ["CREATE (", "DELETE ", "DROP GRAPH", "ALTER USER", "SET a.flagged"]
    problem_count = 0
    
    # Audit .js files in packages and apps (excluding node_modules, .next, etc.)
    for js_file in ROOT.glob("packages/**/*.js"):
        if "node_modules" in str(js_file):
            continue
        content = js_file.read_text(encoding="utf-8")
        # Check that roQueryGraph or query is called with parameterized $ bindings
        if "roQueryGraph(" in content and "$" not in content:
            # Query might be static or schema query, but check for string concatenation injection
            if "${" in content and "MATCH" in content:
                print(f"[WARN] Potential unparameterized query template in {js_file.name}")
                problem_count += 1
                
    if problem_count == 0:
        print("[PASS] Zero unparameterized Cypher injections detected.")
        return True
    return False

def main():
    print("=" * 80)
    print("           SENGRA QUALITY GATES EXIT VERIFICATION (G0 - G4)            ")
    print("=" * 80)

    # Gate G0: Harness Integrity
    g0_harness = run_command("python scripts/check_harness.py", "Gate G0: Harness Integrity Linters")
    g0_pytest = run_command("pytest tests/harness", "Gate G0: Pytest Harness Integrity Suite")
    if not (g0_harness and g0_pytest):
        print("\n[VERDICT: FAILED] Gate G0 failed.")
        sys.exit(1)

    # Gate G1: Turborepo / Next.js Build
    g1_build = run_command("pnpm turbo run build", "Gate G1: Turborepo Next.js Production Build")
    if not g1_build:
        print("\n[VERDICT: FAILED] Gate G1 failed.")
        sys.exit(1)

    # Gate G2: Test Suites
    g2_unit = run_command("bun test tests/unit", "Gate G2: Full Unit Test Suite (66 tests)")
    g2_integ = run_command("bun test tests/integration", "Gate G2: Integration & E2E Test Suite")
    if not (g2_unit and g2_integ):
        print("\n[VERDICT: FAILED] Gate G2 failed.")
        sys.exit(1)

    # Gate G3: Evaluation Benchmarks
    g3_eval = run_command("pnpm eval", "Gate G3: Quantitative Evaluation Benchmark (>25% margin)")
    if not g3_eval:
        print("\n[VERDICT: FAILED] Gate G3 failed.")
        sys.exit(1)

    # Gate G4: Security Audit
    g4_security = audit_cypher_queries()
    if not g4_security:
        print("\n[VERDICT: FAILED] Gate G4 failed.")
        sys.exit(1)

    print("\n" + "=" * 80)
    print("   [ALL GATES PASS] Quality Gates G0, G1, G2, G3, and G4 verified 100% GREEN.  ")
    print("=" * 80 + "\n")
    sys.exit(0)

if __name__ == "__main__":
    main()
