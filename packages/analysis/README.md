# @sengra/analysis

In-process Graphology analytics engine for SENGRA.

## Capabilities
- **Louvain Community Detection**: Partitions connected entities into distinct communities based on modularity optimization.
- **Betweenness Centrality**: Computes centrality scores across nodes to identify critical bridges and mule accounts connecting clusters.
- **Connected Components**: Identifies weakly connected components in subgraphs.
- **WCC Cross-Check Verification**: Compares FalkorDB in-database weakly connected component counts against in-process Graphology counts to detect discrepancies and route ambiguous cases to `HOLD`.

## API
```javascript
import { analyzeSubgraph, crossCheckComponents } from "@sengra/analysis";

const metrics = analyzeSubgraph(nodes, edges);
// metrics.communities, metrics.betweenness, metrics.bridgeNodes, metrics.density, metrics.components

const check = crossCheckComponents(falkorWccCount, graphologyComponentCount);
// check.matches, check.confidenceModifier, check.recommendation
```
