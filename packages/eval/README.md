# @sengra/eval

Evaluation and benchmark package for SENGRA.

## Comparative Benchmarking
Contrasts SENGRA's Graph-Native Agent against legacy single-row Flat-Table heuristics:

| Feature | SENGRA Graph Agent | Flat-Table Baseline |
|---|---|---|
| **Multi-Hop Traversal** | Deep graph neighborhood expansion ($\le 3$ hops) | 1-hop direct device links only |
| **Community Clustering** | In-process Louvain modularity | None |
| **Skeptic Challenge** | Proactive verification of benign explanations | None (naive thresholds) |
| **Ring A (Mule Ring)** | **100% Detected** (Catches collector mule 2 hops away) | **Missed** (False Negative) |
| **Ring B (Family Cluster)** | **100% Cleared** (Identifies residential pattern) | **Frozen** (False Positive) |

## API
```javascript
import { evaluateBaseline, compareAgentVsBaseline } from "@sengra/eval";

const comparison = await compareAgentVsBaseline(context);
console.log(comparison.winner); // "GRAPH_AGENT"
```
