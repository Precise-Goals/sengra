/**
 * @file packages/memory/src/index.js
 * @description Main export for @sengra/memory: cases, decisions, and cross-session recall.
 */

import { saveCase, getCase } from "./cases.js";
import { saveDecision, getDecisionsForEntity } from "./decisions.js";
import { findPastInvestigations } from "./recall.js";
import { clearMemoryStore, getMemoryStore } from "./store.js";

export {
  saveCase,
  getCase,
  saveDecision,
  getDecisionsForEntity,
  findPastInvestigations,
  clearMemoryStore,
  getMemoryStore,
};

export default {
  saveCase,
  getCase,
  saveDecision,
  getDecisionsForEntity,
  findPastInvestigations,
  clearMemoryStore,
  getMemoryStore,
};
