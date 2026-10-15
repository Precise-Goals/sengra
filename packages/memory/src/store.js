/**
 * @file packages/memory/src/store.js
 * @description In-memory store fallback for cases and decisions to support unit testing and offline execution.
 */

const inMemoryCases = new Map();
const inMemoryDecisions = new Map();

export function getMemoryStore() {
  return {
    cases: inMemoryCases,
    decisions: inMemoryDecisions,
  };
}

export function clearMemoryStore() {
  inMemoryCases.clear();
  inMemoryDecisions.clear();
}

export default {
  getMemoryStore,
  clearMemoryStore,
};
