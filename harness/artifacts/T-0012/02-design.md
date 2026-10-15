---
status: complete
owner: designer
task: T-0012
inputs: ["harness/artifacts/T-0012/01-spec.md"]
acceptance_refs: ["AC-013-a", "AC-013-b", "AC-013-c"]
---

# 02-design: Evaluation Engine & Compare Page Architecture

## Metrics Definitions
- **Precision**: $TP / (TP + FP)$ — Proportion of frozen accounts that were actual fraud syndicates.
- **Recall**: $TP / (TP + FN)$ — Proportion of actual fraud syndicates successfully detected and frozen.
- **F1 Score**: $2 \cdot (Precision \cdot Recall) / (Precision + Recall)$
- **False-Positive Rate**: $FP / (FP + TN)$ — Proportion of benign family accounts mistakenly frozen.

## Target Benchmark Thresholds
| Metric | SENGRA Graph Agent | Flat-Table Baseline | Target Delta |
|---|---|---|---|
| Precision | $\ge 0.95$ | $\le 0.65$ | $+30\%$ |
| Recall | $\ge 0.95$ | $\le 0.55$ | $+40\%$ |
| False Positive Rate | $\le 0.05$ | $\ge 0.35$ | $-30\%$ |

## UI `/compare` Design
- Split screen: Left half = "SENGRA Graph Agent (FalkorDB + Skeptic)", Right half = "Legacy Flat-Table Baseline".
- Comparative verdict cards with side-by-side justification diffs.
- Interactive scenario toggle (Ring A, Ring B, Ring C).
- Global benchmark metrics scoreboard at top.
