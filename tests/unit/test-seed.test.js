/**
 * @file tests/unit/test-seed.test.js
 * @description Unit tests for seedDatabase utility in dry-run mode.
 */

import { describe, it, expect } from "bun:test";
import { seedDatabase } from "../../packages/data/src/seed.js";

describe("Database Seed Utility Tests", () => {
  it("executes seedDatabase in dry-run mode and returns synthetic graph data", async () => {
    const data = await seedDatabase({ seed: 100, dryRun: true });

    expect(data).toBeDefined();
    expect(data.nodes).toBeDefined();
    expect(data.edges).toBeDefined();
    expect(data.nodes.length).toBeGreaterThan(100);
    expect(data.summary).toBeDefined();
    expect(data.summary.ringAAccounts).toBe(8);
    expect(data.summary.ringBAccounts).toBe(5);
  });
});
