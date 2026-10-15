---
status: complete
owner: po-spec
task: T-0008
inputs: ["harness/tasks/T-0008.md", "docs/harness.md"]
acceptance_refs: ["AC-009-a", "AC-009-b", "AC-009-c"]
---

# 01-spec: Dark Ops Console & Cytoscape Canvas

## Problem Statement
Fraud investigators need an intuitive, high-contrast visualization canvas to inspect fraud ring topology and observe live agent reasoning steps. A generic table or JSON dump does not convey multi-hop connections, mule bridges, or device sharing.

## Scope
- Implement Cytoscape stylesheet with distinct visual encoding for Accounts, Devices, Cards, and Addresses.
- Implement reusable `GraphCanvas` component with concentric/breadthfirst layouts.
- Implement dark ops console layout in `apps/web/src/app/page.jsx` with demo alert triggers for Ring A, Ring B, and Ring C.
