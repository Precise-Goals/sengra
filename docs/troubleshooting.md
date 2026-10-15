# SENGRA — Production Runbook & Troubleshooting Guide

> Operational diagnostics, common error signatures, and mitigation procedures.

---

## 1. FalkorDB Cloud Connectivity

### Error: `ECONNREFUSED` or TLS Handshake Failure
* **Symptom**: `Failed to connect to FalkorDB Cloud at host:port`.
* **Cause**: Missing TLS flag or firewall blocking port 6379/16379.
* **Resolution**:
  1. Confirm `FALKORDB_TLS=true` in `.env.local` or Vercel environment variables.
  2. Verify that `FALKORDB_HOST` does not include protocol prefixes (e.g. use `xyz.falkordb.cloud`, not `tls://xyz.falkordb.cloud`).
  3. Ensure outbound port 6379 is open on your network.

### Multi-Tenant Graph Collisions
* **Symptom**: Local test runs overwriting demo or staging graphs.
* **Resolution**: SENGRA uses `FALKORDB_GRAPH_PREFIX`:
  * Locally: `FALKORDB_GRAPH_PREFIX=dev_` (selects `dev_domain`, `dev_agent_memory`, `dev_decisions`).
  * In Production: `FALKORDB_GRAPH_PREFIX=prod_`.

---

## 2. Next.js Turbopack & Bundling

### Error: `TypeError: a.BigInt is not a function` or Module Not Found
* **Symptom**: Turbopack crashes when compiling pages importing `@sengra/graph`.
* **Cause**: Next.js client-side Turbopack compiler attempting to bundle Node native sockets and BigInt packages.
* **Resolution**: Ensure `apps/web/next.config.mjs` contains:
  ```js
  serverExternalPackages: ["falkordb"]
  ```

---

## 3. Circuit Breakers & Harness Guardrails

Thresholds configured in `harness/state/budgets.json`:

| Breaker | Threshold | Remediation |
|---|---|---|
| `max_build_attempts` | 3 attempts | Run `bun test tests/unit` locally before triggering remote builds |
| `max_turn_budget` | 50 turns | Commit completed task stages atomically |
| `path_guard` | Role allow-list | Ensure active lane lock is registered in `harness/state/locks/` |

To reset a tripped breaker after fixing the root cause:
```bash
python scripts/breaker.py --reset
```

---

## 4. Running Verification

Before deploying or submitting PRs, run the unified verification pipeline:
```bash
python scripts/verify_gates.py
```
This validates quality gates G0 through G4 with zero manual intervention.
