/**
 * @file Deterministic synthetic graph data generator.
 */

/**
 * Generates synthetic domain graph datasets for seeding and testing.
 * @param {{ seed?: number; accountCount?: number }} [options]
 * @returns {{ accounts: any[]; devices: any[]; transactions: any[]; groundTruth: any[] }}
 */
export function generateSyntheticData(options = {}) {
  return {
    accounts: [],
    devices: [],
    transactions: [],
    groundTruth: [],
  };
}

export default {
  generateSyntheticData,
};
