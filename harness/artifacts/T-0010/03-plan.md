---
status: complete
owner: tech-lead
task: T-0010
inputs: ["harness/artifacts/T-0010/01-spec.md", "harness/artifacts/T-0010/02-design.md"]
acceptance_refs: ["AC-011-a", "AC-011-b", "AC-011-c"]
---

# 03-plan: Implementation Plan for Animated Path Synchronization

## Lane Decomposition
- Lane: `path-animator`
- Owned paths:
  - `packages/ui/src/path-animator.js`
  - `packages/ui/src/index.js`
  - `apps/web/src/app/page.jsx`
  - `tests/unit/test-animator.test.js`

## Plan Steps
1. Author red test suite in `tests/unit/test-animator.test.js` verifying:
   - Sequence generation from node paths.
   - Stepper timer logic and callback invocations.
   - Fallback on single-node or empty paths.
2. Create lane lock in `harness/state/locks/path-animator.json`.
3. Implement `packages/ui/src/path-animator.js`.
4. Export from `packages/ui/src/index.js`.
5. Connect playback animation to `apps/web/src/app/page.jsx`.
6. Run unit tests and Next.js build to verify 100% green.
