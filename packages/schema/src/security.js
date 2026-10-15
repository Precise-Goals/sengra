/**
 * @file packages/schema/src/security.js
 * @description Zod schemas and types for the Security Bonus Layer (Services, CVEs, Credentials, Blast Radius).
 */

import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tier: z.enum(["TIER_0", "TIER_1", "TIER_2", "TIER_3"]).default("TIER_1"),
  repo: z.string().optional(),
  exposed_via: z.enum(["PUBLIC_INTERNET", "INTERNAL_VPC", "RESTRICTED"]).default("INTERNAL_VPC"),
  owner_team: z.string().optional(),
});

export const CVESchema = z.object({
  id: z.string().regex(/^CVE-\d{4}-\d{4,7}$/),
  cvss: z.number().min(0).max(10),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string().optional(),
  published_at: z.string().optional(),
});

export const CredentialSchema = z.object({
  id: z.string().min(1),
  compromised: z.boolean().default(false),
  serviceId: z.string().optional(),
  accountId: z.string().optional(),
  leaked_at: z.string().optional(),
});

export const PackageSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  ecosystem: z.string().default("npm"),
});

export const DatastoreSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["POSTGRES", "REDIS", "FALKORDB", "S3", "KAFKA"]).default("POSTGRES"),
  contains_pii: z.boolean().default(false),
});

export const BlastRadiusSchema = z.object({
  serviceId: z.string().min(1),
  downstreamServices: z.array(z.string()),
  affectedDatastores: z.array(z.string()),
  exposedEndPoints: z.array(z.string()).optional(),
  totalImpactedEntities: z.number().min(0),
});

export const FindingPrioritySchema = z.object({
  cveId: z.string().min(1),
  score: z.number(),
  priority: z.enum(["P0", "P1", "P2", "P3"]),
  rationale: z.string(),
});

export default {
  ServiceSchema,
  CVESchema,
  CredentialSchema,
  PackageSchema,
  DatastoreSchema,
  BlastRadiusSchema,
  FindingPrioritySchema,
};
