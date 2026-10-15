# Project Glossary

> Domain terminology, graph algorithms, and architectural concepts for SENGRA.

- **WCC (Weakly Connected Components)**: Graph algorithm grouping nodes where any path exists ignoring edge directions; used to isolate fraud rings.
- **PageRank**: Centrality algorithm ranking node importance based on incoming connection structure; identifies collector mules.
- **Louvain**: Community detection algorithm optimizing modularity; partitions dense subgraphs into clusters.
- **Betweenness Centrality**: Metric measuring how often a node falls on the shortest path between other nodes; identifies bridge accounts/devices.
- **Skeptic Check**: Deterministic rule verification checking for benign patterns (e.g. shared family address/IP) to prevent false-positive freezes.
- **Domain Graph (`domain`)**: FalkorDB graph partition storing customer, account, device, transaction, and security nodes.
- **Agent Memory Graph (`agent_memory`)**: FalkorDB graph partition storing historical investigations, prior cases, clearances, and learned patterns.
- **Decisions Graph (`decisions`)**: FalkorDB graph partition storing immutable audit logs of decisions, evidence paths, and simulated actions.
- **Evidence Path**: Sequence of nodes and edges connecting a suspect account to bad actors or illicit transactions.
- **Fluid Compute**: Vercel serverless compute environment allowing extended execution times and streaming responses.
- **MCP (Model Context Protocol)**: Standardized open protocol for exposing tools and resources to LLMs.
