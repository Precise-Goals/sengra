/**
 * @file packages/data/src/seed.js
 * @description Seed CLI script to load generated synthetic data into FalkorDB domain graph.
 */

import { generateSyntheticData } from "./generator.js";

export async function seedDatabase(options = {}) {
  const seed = options.seed || 42;
  console.log(`Generating synthetic graph with seed=${seed}...`);
  const data = generateSyntheticData(seed, options);

  console.log(`Generated ${data.nodes.length} nodes and ${data.edges.length} edges.`);
  console.log(`Planted rings: Ring A (${data.summary.ringAAccounts} accounts), Ring B (${data.summary.ringBAccounts} accounts), Ring C (${data.summary.ringCAccounts} accounts).`);

  if (options.dryRun) {
    console.log("Dry run complete; skipping FalkorDB mutations.");
    return data;
  }

  try {
    // Dynamically import graph client if available
    const { domain } = await import("@sengra/graph");
    const graph = await domain();
    console.log("Connected to FalkorDB domain graph. Loading entities...");

    // Batch node creation
    for (const node of data.nodes) {
      const cypher = `MERGE (n:${node.label} {id: $id}) SET n += $props`;
      await graph.query(cypher, { params: { id: node.id, props: node.properties } });
    }

    // Batch edge creation
    for (const edge of data.edges) {
      const cypher = `
        MATCH (a {id: $source}), (b {id: $target})
        MERGE (a)-[r:${edge.type}]->(b)
        SET r += $props
      `;
      await graph.query(cypher, { params: { source: edge.source, target: edge.target, props: edge.properties } });
    }

    console.log("Database seeded successfully!");
  } catch (err) {
    console.warn("FalkorDB connection not active or skipped; synthetic dataset created in memory:", err.message);
  }

  return data;
}

// Direct CLI invocation
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  seedDatabase({ dryRun: process.env.DRY_RUN === "true" })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default seedDatabase;
