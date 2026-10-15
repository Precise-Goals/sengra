---
status: complete
owner: designer
task: T-0003
inputs: ["01-spec.md"]
acceptance_refs: ["AC-009-a", "AC-009-ring-a", "AC-009-ring-b", "AC-009-gt"]
---

# 02-design: Synthetic Graph Generator Architecture

## Planted Ring A (Mule Ring)
- Accounts: `A-RINGA-1` through `A-RINGA-7` and `A-RINGA-COLLECTOR`.
- Devices: `D-17` (`known_bad: true`), `D-18`.
- Payment loop: Circular funnel transfers terminating at `A-RINGA-COLLECTOR`.

## Planted Ring B (Family Cluster)
- Accounts: `A-RINGB-1` through `A-RINGB-5`.
- Shared address: `ADDR-FAMILY-01`.
- Shared IP: `IP-FAMILY-WIFI`.
- Zero known-bad devices.

## Background Noise
- ~450 normal accounts, 150 devices, 100 IPs, 200 addresses, 4 merchants.
