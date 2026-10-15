# ADR-0001: Managed FalkorDB Cloud Instance

## Status
Accepted

## Context
SENGRA operates on Vercel serverless / fluid compute functions. Vercel functions are stateless and cannot host a stateful graph database process directly. Docker or self-hosted VPS setups add significant operational maintenance overhead for a solo developer.

## Decision
Use managed FalkorDB Cloud over TLS for all environments, isolating local development, integration testing, and production deployment through graph name prefixes (`dev_domain`, `test_domain`, `prod_domain`).

## Consequences
- No Docker or database host management required.
- Requires TLS configuration and environment secrets (`FALKORDB_HOST`, `FALKORDB_PORT`, `FALKORDB_USERNAME`, `FALKORDB_PASSWORD`, `FALKORDB_TLS`).
- Client connections must be cached on `globalThis` to minimize handshake latency across serverless warm restarts.
