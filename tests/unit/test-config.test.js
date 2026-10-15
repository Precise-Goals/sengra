/**
 * @file tests/unit/test-config.test.js
 * @description Unit tests for @sengra/config package exports and shared tooling settings.
 */

import { describe, it, expect } from "bun:test";
import { prettierConfig } from "../../packages/config/src/index.js";

describe("Shared Config Package Tests", () => {
  it("exports valid Prettier configuration", () => {
    expect(prettierConfig).toBeDefined();
    expect(prettierConfig.semi).toBe(true);
    expect(prettierConfig.tabWidth).toBe(2);
    expect(prettierConfig.trailingComma).toBe("es5");
  });
});
