import { describe, it, expect, beforeEach } from "bun:test";
import { getGraphName } from "../../packages/graph/src/index.js";

describe("FalkorDB Client & Prefixing Tests", () => {
  beforeEach(() => {
    delete process.env.FALKORDB_GRAPH_PREFIX;
  });

  it("applies default dev_ prefix to graph names", () => {
    expect(getGraphName("domain")).toBe("dev_domain");
    expect(getGraphName("agent_memory")).toBe("dev_agent_memory");
    expect(getGraphName("decisions")).toBe("dev_decisions");
  });

  it("applies custom environment prefix when set", () => {
    process.env.FALKORDB_GRAPH_PREFIX = "test_";
    expect(getGraphName("domain")).toBe("test_domain");
    expect(getGraphName("agent_memory")).toBe("test_agent_memory");
  });

  it("handles empty prefix cleanly", () => {
    process.env.FALKORDB_GRAPH_PREFIX = "";
    expect(getGraphName("domain")).toBe("domain");
  });
});
