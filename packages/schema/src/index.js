/**
 * @file Domain entity schemas and runtime validation boundaries.
 */

/**
 * @typedef {Object} NodeEntity
 * @property {string} id
 * @property {string} label
 * @property {Record<string, any>} [properties]
 */

/**
 * @typedef {Object} EdgeEntity
 * @property {string} source
 * @property {string} target
 * @property {string} type
 * @property {Record<string, any>} [properties]
 */

export const SCHEMA_VERSION = "0.1.0";

export default {
  SCHEMA_VERSION,
};
