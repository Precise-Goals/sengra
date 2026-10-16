/**
 * @file apps/web/src/components/NetworkXGraphVisualizer.jsx
 * @description Ultra-modern HTML5 Canvas Graph Physics Engine for SENGRA.
 *
 * Capabilities:
 * - Fruchterman-Reingold Spring Layout (Coulomb repulsion F ∝ 1/d², Hooke attraction F = k·Δx,
 *   center gravity, 0.82 velocity damping).
 * - 4-tier Kahn DAG Layout (Upstream APIs -> Adapters -> Workflows -> Downstream Databases/Accounts).
 * - Concentric Shockwave Blast-Radius Layout (Epicenter ring 0 -> Hop 1 -> Hop 2 -> Hop 3+).
 * - Live packet throughput animation with glowing trails via requestAnimationFrame.
 * - Interactive pointer physics: cursor-anchored zoom/pan, spring node dragging, hover glow HUD,
 *   click selection with incident edge spotlights, and animated shockwave rings for flagged/frozen nodes.
 * - Dark Obsidian (#040608) and Electric Neon Green (#00ff66, #22c55e) liquid glass styling.
 */

"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

// ============================================================================
// DEFAULT FALLBACK DATASET (Financial Crime & Pipeline Graph)
// ============================================================================
const DEFAULT_DEMO_NODES = [
  // Tier 0: Upstream APIs / Clients / Ingress
  {
    id: "API-INGRESS-01",
    label: "API",
    name: "Stripe Webhook Gateway",
    tier: 0,
    status: "NORMAL",
    inboundRps: 142,
  },
  {
    id: "IP-MALICIOUS-42",
    label: "IPAddress",
    name: "198.51.100.42 (Tor Exit)",
    tier: 0,
    status: "FLAGGED",
    flagged: true,
    riskScore: 98,
  },
  {
    id: "DEV-RIG-17",
    label: "Device",
    name: "Fraud Rig D-17",
    tier: 0,
    status: "FLAGGED",
    flagged: true,
    known_bad: true,
    riskScore: 95,
  },
  {
    id: "CLIENT-MOBILE-3",
    label: "Device",
    name: "Mobile Client v4.8",
    tier: 0,
    status: "NORMAL",
  },

  // Tier 1: Adapters / Gateways / Decoders
  {
    id: "ADAPT-PAYMENT",
    label: "Adapter",
    name: "ISO8583 Payment Ingestion",
    tier: 1,
    status: "NORMAL",
    latency: "1.4ms",
  },
  {
    id: "ADAPT-AUTH",
    label: "Adapter",
    name: "OAuth Token Validator",
    tier: 1,
    status: "NORMAL",
  },
  {
    id: "PROXY-LATENCY",
    label: "Adapter",
    name: "Zero-Trust Ingress Proxy",
    tier: 1,
    status: "NORMAL",
  },

  // Tier 2: Workflows / Engine / State Machines
  {
    id: "WF-FRAUD-RULES",
    label: "Workflow",
    name: "F4 Circular Flow Policy",
    tier: 2,
    status: "FLAGGED",
    flagged: true,
    rulesEvaluated: 48,
  },
  {
    id: "WF-VELOCITY",
    label: "Workflow",
    name: "Velocity Engine 60s",
    tier: 2,
    status: "NORMAL",
  },
  {
    id: "WF-GRAPH-WALKER",
    label: "Workflow",
    name: "FalkorDB Subgraph Crawler",
    tier: 2,
    status: "NORMAL",
  },

  // Tier 3: Downstream Databases / Sinks / Accounts
  {
    id: "ACC-MULE-PRIMARY",
    label: "Account",
    name: "Victim Mule ACC-901",
    tier: 3,
    status: "FROZEN",
    flagged: true,
    frozen: true,
    balance: "$84,200",
    riskScore: 94,
  },
  {
    id: "ACC-RECRUITER",
    label: "Account",
    name: "Recruiter Mule ACC-902",
    tier: 3,
    status: "FLAGGED",
    flagged: true,
    balance: "$12,450",
    riskScore: 88,
  },
  {
    id: "ACC-COLLECTOR",
    label: "Account",
    name: "Collector Shell Corp ACC-888",
    tier: 3,
    status: "FLAGGED",
    flagged: true,
    known_bad: true,
    balance: "$240,000",
    riskScore: 99,
  },
  {
    id: "DB-FALKOR",
    label: "Database",
    name: "FalkorDB Graph Cluster",
    tier: 3,
    status: "NORMAL",
  },
  {
    id: "DB-SETTLEMENT",
    label: "Database",
    name: "Fedwire Ledger Sink",
    tier: 3,
    status: "NORMAL",
  },
];

const DEFAULT_DEMO_EDGES = [
  {
    id: "e-tor-adapt",
    source: "IP-MALICIOUS-42",
    target: "ADAPT-PAYMENT",
    type: "HTTP_POST",
    throughput: 45,
    risk: "HIGH",
  },
  {
    id: "e-rig-auth",
    source: "DEV-RIG-17",
    target: "ADAPT-AUTH",
    type: "SESSION_HANDSHAKE",
    throughput: 12,
    risk: "HIGH",
  },
  {
    id: "e-api-adapt",
    source: "API-INGRESS-01",
    target: "ADAPT-PAYMENT",
    type: "WEBHOOK",
    throughput: 110,
  },
  {
    id: "e-mob-proxy",
    source: "CLIENT-MOBILE-3",
    target: "PROXY-LATENCY",
    type: "TLS_CONNECT",
    throughput: 34,
  },

  {
    id: "e-adapt-wf1",
    source: "ADAPT-PAYMENT",
    target: "WF-FRAUD-RULES",
    type: "INSPECT_TRANSACTION",
    throughput: 155,
  },
  {
    id: "e-auth-wf2",
    source: "ADAPT-AUTH",
    target: "WF-VELOCITY",
    type: "TOKEN_VERIFY",
    throughput: 18,
  },
  {
    id: "e-proxy-wf3",
    source: "PROXY-LATENCY",
    target: "WF-GRAPH-WALKER",
    type: "ROUTE_HOP",
    throughput: 30,
  },
  {
    id: "e-wf1-wf3",
    source: "WF-FRAUD-RULES",
    target: "WF-GRAPH-WALKER",
    type: "TRIGGER_SUBGRAPH",
    throughput: 42,
  },

  {
    id: "e-wf1-mule1",
    source: "WF-FRAUD-RULES",
    target: "ACC-MULE-PRIMARY",
    type: "FLAG_SANCTION",
    throughput: 65,
    risk: "CRITICAL",
  },
  {
    id: "e-wf1-mule2",
    source: "WF-FRAUD-RULES",
    target: "ACC-RECRUITER",
    type: "TRACE_PAYLOAD",
    throughput: 50,
  },
  {
    id: "e-mule1-collector",
    source: "ACC-MULE-PRIMARY",
    target: "ACC-COLLECTOR",
    type: "RAPID_TRANSFER",
    throughput: 88,
    risk: "CRITICAL",
  },
  {
    id: "e-mule2-collector",
    source: "ACC-RECRUITER",
    target: "ACC-COLLECTOR",
    type: "RAPID_TRANSFER",
    throughput: 72,
    risk: "CRITICAL",
  },
  {
    id: "e-wf3-falkor",
    source: "WF-GRAPH-WALKER",
    target: "DB-FALKOR",
    type: "CYPHER_QUERY",
    throughput: 120,
  },
  {
    id: "e-wf1-settle",
    source: "WF-FRAUD-RULES",
    target: "DB-SETTLEMENT",
    type: "HOLD_SETTLEMENT",
    throughput: 14,
  },
];

// ============================================================================
// COLOR PALETTES & THEME CONFIGURATION
// ============================================================================
const THEME = {
  bg: "#040608",
  gridDot: "rgba(0, 255, 102, 0.08)",
  gridLine: "rgba(255, 255, 255, 0.03)",
  textPrimary: "#f4f4f6",
  textSecondary: "#8b949e",
  textMuted: "#484f58",

  // Neon Green Accents
  neonGreen: "#00ff66",
  neonGreenSubtle: "rgba(0, 255, 102, 0.15)",
  neonGreenGlow: "rgba(0, 255, 102, 0.55)",
  neonEmerald: "#22c55e",

  // State Accents
  neonCyan: "#06b6d4",
  neonCyanGlow: "rgba(6, 182, 212, 0.6)",
  neonAmber: "#f59e0b",
  neonDanger: "#ff3366",
  neonDangerGlow: "rgba(255, 51, 102, 0.65)",

  // Edges & Glass
  edgeNormal: "rgba(255, 255, 255, 0.15)",
  edgeDimmed: "rgba(255, 255, 255, 0.04)",
  edgeHighlighted: "#00ff66",
  edgeDanger: "#ff3366",

  // Node Tiers
  tierColors: {
    0: { fill: "#0c1815", border: "#00ff66", label: "UPSTREAM APIS / INGRESS" },
    1: { fill: "#0c1622", border: "#06b6d4", label: "ADAPTERS / PROXIES" },
    2: { fill: "#151324", border: "#a855f7", label: "WORKFLOWS / ENGINES" },
    3: { fill: "#1f1018", border: "#ff3366", label: "DOWNSTREAM ACCOUNTS / DBS" },
  },

  // Node Type Glyphs & Colors
  nodeTypes: {
    API: { color: "#00ff66", glyph: "⚡" },
    IPAddress: { color: "#f59e0b", glyph: "🌐" },
    Device: { color: "#06b6d4", glyph: "💻" },
    Adapter: { color: "#38bdf8", glyph: "🔌" },
    Workflow: { color: "#a855f7", glyph: "⚙️" },
    Account: { color: "#00ff66", glyph: "👤" },
    Database: { color: "#10b981", glyph: "🗄️" },
    Card: { color: "#f43f5e", glyph: "💳" },
    Address: { color: "#eab308", glyph: "📍" },
  },
};

// ============================================================================
// HELPER: Kahn's DAG Algorithm & Topological Tiering
// ============================================================================
/**
 * Partitions nodes into 4 topological tiers using Kahn's algorithm
 * and semantic fallback classification.
 *
 * @param {Array<object>} nodes
 * @param {Array<object>} edges
 * @returns {Map<string, number>} Node ID to Tier (0, 1, 2, 3)
 */
function computeKahn4Tiers(nodes, edges) {
  const nodeMap = new Map();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const inDegree = new Map();
  const adj = new Map();

  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  });

  edges.forEach((e) => {
    if (inDegree.has(e.target) && adj.has(e.source)) {
      inDegree.set(e.target, inDegree.get(e.target) + 1);
      adj.get(e.source).push(e.target);
    }
  });

  // Kahn's Algorithm queue
  const queue = [];
  const levelMap = new Map();

  nodes.forEach((n) => {
    if (inDegree.get(n.id) === 0) {
      queue.push(n.id);
      levelMap.set(n.id, 0);
    }
  });

  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    const currentLevel = levelMap.get(u) || 0;

    for (const v of adj.get(u) || []) {
      const newDeg = inDegree.get(v) - 1;
      inDegree.set(v, newDeg);
      const nextLevel = Math.max(levelMap.get(v) || 0, currentLevel + 1);
      levelMap.set(v, nextLevel);
      if (newDeg === 0) {
        queue.push(v);
      }
    }
  }

  // Find max topological depth
  let maxDepth = 1;
  levelMap.forEach((depth) => {
    if (depth > maxDepth) maxDepth = depth;
  });

  // Map to 4 discrete tiers:
  // Tier 0: Upstream APIs / Sources
  // Tier 1: Adapters
  // Tier 2: Workflows
  // Tier 3: Downstream Databases / Accounts
  const tierMap = new Map();

  nodes.forEach((n) => {
    // If explicit tier provided in data, respect it
    if (typeof n.tier === "number" && n.tier >= 0 && n.tier <= 3) {
      tierMap.set(n.id, n.tier);
      return;
    }

    // Semantic label classification fallback
    const labelUpper = (n.label || "").toUpperCase();
    if (
      labelUpper === "API" ||
      labelUpper === "IPADDRESS" ||
      labelUpper === "DEVICE" ||
      labelUpper === "CLIENT"
    ) {
      tierMap.set(n.id, 0);
      return;
    }
    if (
      labelUpper === "ADAPTER" ||
      labelUpper === "PROXY" ||
      labelUpper === "GATEWAY" ||
      labelUpper === "MIDDLEWARE"
    ) {
      tierMap.set(n.id, 1);
      return;
    }
    if (
      labelUpper === "WORKFLOW" ||
      labelUpper === "PIPELINE" ||
      labelUpper === "ENGINE" ||
      labelUpper === "RULE"
    ) {
      tierMap.set(n.id, 2);
      return;
    }
    if (
      labelUpper === "ACCOUNT" ||
      labelUpper === "DATABASE" ||
      labelUpper === "LEDGER" ||
      labelUpper === "CARD" ||
      labelUpper === "SINK"
    ) {
      tierMap.set(n.id, 3);
      return;
    }

    // Mathematical Kahn depth tiering: scale [0, maxDepth] into [0, 3]
    const depth = levelMap.get(n.id) || 0;
    const computedTier = Math.min(3, Math.floor((depth / (maxDepth + 0.001)) * 4));
    tierMap.set(n.id, computedTier);
  });

  return tierMap;
}

// ============================================================================
// HELPER: Breadth-First Search for Concentric Hop Distance
// ============================================================================
/**
 * Computes shortest hop distance from epicenter node to all reachable nodes.
 *
 * @param {string} epicenterId
 * @param {Array<object>} nodes
 * @param {Array<object>} edges
 * @returns {Map<string, number>}
 */
function computeHopDistances(epicenterId, nodes, edges) {
  const hopMap = new Map();
  const adj = new Map();

  nodes.forEach((n) => {
    adj.set(n.id, []);
    hopMap.set(n.id, Infinity);
  });

  edges.forEach((e) => {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source).push(e.target);
      adj.get(e.target).push(e.source); // undirected hop distance
    }
  });

  if (!epicenterId || !hopMap.has(epicenterId)) {
    // Pick first flagged node, or first node
    const firstFlagged = nodes.find((n) => n.flagged || n.known_bad || n.frozen);
    epicenterId = firstFlagged ? firstFlagged.id : nodes[0]?.id;
  }

  if (!epicenterId) return hopMap;

  hopMap.set(epicenterId, 0);
  const queue = [epicenterId];
  let head = 0;

  while (head < queue.length) {
    const u = queue[head++];
    const currentHop = hopMap.get(u);

    for (const v of adj.get(u) || []) {
      if (hopMap.get(v) === Infinity) {
        hopMap.set(v, currentHop + 1);
        queue.push(v);
      }
    }
  }

  // For disconnected nodes, give them hop 3
  nodes.forEach((n) => {
    if (hopMap.get(n.id) === Infinity) {
      hopMap.set(n.id, 3);
    }
  });

  return hopMap;
}

// ============================================================================
// MAIN COMPONENT: NetworkXGraphVisualizer
// ============================================================================
/**
 * High-performance HTML5 Canvas Graph Physics Engine with pure React.
 *
 * @param {object} props
 * @param {Array<object>} [props.nodes] - Graph nodes array
 * @param {Array<object>} [props.edges] - Graph edges array
 * @param {Array<object>} [props.elements] - Cytoscape-style elements array fallback
 * @param {string} [props.layout] - "fruchterman-reingold" | "kahn-dag" | "shockwave"
 * @param {string} [props.selectedNodeId] - Controlled selected node ID
 * @param {Function} [props.onNodeClick] - Node selection callback
 * @param {Array<string>} [props.highlightedNodeIds] - Array of node IDs to emphasize
 * @param {Array<string>} [props.highlightedEdgeIds] - Array of edge IDs to emphasize
 * @param {string} [props.epicenterNodeId] - Epicenter node ID for shockwave blast layout
 * @param {boolean} [props.showParticles=true] - Toggle edge traffic flow particles
 * @param {number} [props.particleSpeed=1.0] - Multiplier for packet flow velocity
 * @param {string} [props.className] - CSS class name
 */
export default function NetworkXGraphVisualizer({
  nodes: propNodes,
  edges: propEdges,
  elements: propElements,
  layout: propLayout = "fruchterman-reingold",
  selectedNodeId: controlledSelectedId = null,
  onNodeClick,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  epicenterNodeId: propEpicenterId = null,
  showParticles = true,
  particleSpeed = 1.0,
  className = "w-full h-full min-h-[500px]",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const fpsSpanRef = useRef(null);

  // Layout mode state with standard React prop sync
  const [internalLayout, setInternalLayout] = useState(propLayout);
  const [prevPropLayout, setPrevPropLayout] = useState(propLayout);
  if (propLayout !== prevPropLayout) {
    setPrevPropLayout(propLayout);
    setInternalLayout(propLayout);
  }
  const activeLayout = internalLayout;
  const setActiveLayout = setInternalLayout;

  // Selected node state with standard React prop sync
  const [internalSelectedId, setInternalSelectedId] = useState(controlledSelectedId ?? null);
  const [prevControlledSelectedId, setPrevControlledSelectedId] = useState(controlledSelectedId);
  if (controlledSelectedId !== prevControlledSelectedId) {
    setPrevControlledSelectedId(controlledSelectedId);
    setInternalSelectedId(controlledSelectedId ?? null);
  }

  const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);
  const [particlesEnabled, setParticlesEnabled] = useState(showParticles);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Normalize graph data from props or Cytoscape elements
  const { parsedNodes, parsedEdges } = useMemo(() => {
    if (propNodes && propNodes.length > 0) {
      return {
        parsedNodes: propNodes,
        parsedEdges: propEdges || [],
      };
    }

    if (propElements && propElements.length > 0) {
      const nList = [];
      const eList = [];
      propElements.forEach((el) => {
        if (el.group === "nodes" || (!el.group && el.data && !el.data.source)) {
          nList.push({
            id: el.data.id,
            label: el.data.label || "Account",
            name: el.data.name || el.data.id,
            known_bad: Boolean(el.data.known_bad),
            flagged: Boolean(el.data.known_bad || el.data.flagged),
            frozen: Boolean(el.data.frozen),
            ...el.data,
          });
        } else if (
          el.group === "edges" ||
          (!el.group && el.data && el.data.source && el.data.target)
        ) {
          eList.push({
            id: el.data.id || `${el.data.source}->${el.data.target}`,
            source: el.data.source,
            target: el.data.target,
            type: el.data.type || "CONNECTED",
            ...el.data,
          });
        }
      });
      return { parsedNodes: nList, parsedEdges: eList };
    }

    // Fallback demo graph
    return {
      parsedNodes: DEFAULT_DEMO_NODES,
      parsedEdges: DEFAULT_DEMO_EDGES,
    };
  }, [propNodes, propEdges, propElements]);

  // Derived estimated packet throughput
  const estimatedPacketsCount = useMemo(() => {
    return parsedEdges.reduce((acc, e) => {
      const packetCount = Math.max(1, Math.min(4, Math.floor((e.throughput || 50) / 35)));
      return acc + packetCount;
    }, 0);
  }, [parsedEdges]);

  // Active epicenter node
  const activeEpicenterId = useMemo(() => {
    if (propEpicenterId) return propEpicenterId;
    if (internalSelectedId) return internalSelectedId;
    const bad = parsedNodes.find((n) => n.flagged || n.known_bad || n.frozen);
    return bad ? bad.id : parsedNodes[0]?.id;
  }, [propEpicenterId, internalSelectedId, parsedNodes]);

  // Simulation physics mutable storage in ref (pure initialization without side effects)
  const simRef = useRef({
    nodes: [],
    edges: [],
    particles: [],
    nodeMap: new Map(),
    camera: { x: 0, y: 0, k: 1.0 },
    dragState: null, // { isDraggingNode, nodeId, isPanning, startX, startY }
    width: 800,
    height: 600,
    dpr: 1,
    shockwaveRadius: 0,
    lastFrameTime: 0,
    frameCount: 0,
    fpsTimer: 0,
    layoutTargetMap: new Map(), // nodeId -> { targetX, targetY }
  });

  // Calculate layout targets whenever layout mode or nodes change
  const computeLayoutTargets = useCallback(
    (width, height) => {
      const targetMap = new Map();
      const nodeCount = parsedNodes.length;
      if (nodeCount === 0) return targetMap;

      const centerX = width / 2;
      const centerY = height / 2;

      if (activeLayout === "kahn-dag") {
        // 4-Tier Kahn DAG Layout: Upstream -> Adapters -> Workflows -> Downstream
        const tierMap = computeKahn4Tiers(parsedNodes, parsedEdges);
        const tierBuckets = { 0: [], 1: [], 2: [], 3: [] };

        parsedNodes.forEach((n) => {
          const t = tierMap.get(n.id) ?? 1;
          tierBuckets[t].push(n.id);
        });

        const leftMargin = width * 0.14;
        const rightMargin = width * 0.86;
        const colSpacing = (rightMargin - leftMargin) / 3;

        for (let t = 0; t < 4; t++) {
          const idsInTier = tierBuckets[t];
          const x = leftMargin + t * colSpacing;
          const count = idsInTier.length;

          idsInTier.forEach((nodeId, idx) => {
            const verticalPadding = height * 0.16;
            const availableHeight = height - verticalPadding * 2;
            const y =
              count === 1
                ? centerY
                : verticalPadding + (availableHeight * (idx + 0.5)) / count;
            targetMap.set(nodeId, { x, y });
          });
        }
      } else if (activeLayout === "shockwave") {
        // Concentric Shockwave Blast-Radius Layout
        const hopMap = computeHopDistances(
          activeEpicenterId,
          parsedNodes,
          parsedEdges
        );
        const hopBuckets = { 0: [], 1: [], 2: [], 3: [] };

        parsedNodes.forEach((n) => {
          const hop = Math.min(3, hopMap.get(n.id) ?? 3);
          hopBuckets[hop].push(n.id);
        });

        // Center ring 0
        hopBuckets[0].forEach((nodeId) => {
          targetMap.set(nodeId, { x: centerX, y: centerY });
        });

        // Ring radii (tightened concentric clusters)
        const ringRadii = { 1: 95, 2: 175, 3: 250 };

        for (let ring = 1; ring <= 3; ring++) {
          const idsInRing = hopBuckets[ring];
          const radius = ringRadii[ring];
          const count = idsInRing.length;
          const angleStep = (2 * Math.PI) / (count || 1);
          const phaseOffset = ring * 0.35; // visually stagger rings

          idsInRing.forEach((nodeId, idx) => {
            const theta = idx * angleStep + phaseOffset;
            const x = centerX + radius * Math.cos(theta);
            const y = centerY + radius * Math.sin(theta);
            targetMap.set(nodeId, { x, y });
          });
        }
      }

      return targetMap;
    },
    [activeLayout, parsedNodes, parsedEdges, activeEpicenterId]
  );

  // Initialize or re-sync physics simulation nodes and edges
  useEffect(() => {
    const sim = simRef.current;
    const width = sim.width || 800;
    const height = sim.height || 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const existingMap = new Map();
    sim.nodes.forEach((n) => existingMap.set(n.id, n));

    // Construct physical node models
    const newNodes = parsedNodes.map((pn, index) => {
      const prev = existingMap.get(pn.id);
      const angle = (index / (parsedNodes.length || 1)) * 2 * Math.PI;
      const initialRadius = 140 + (index % 3) * 45;

      const x = prev?.x ?? centerX + initialRadius * Math.cos(angle);
      const y = prev?.y ?? centerY + initialRadius * Math.sin(angle);
      const vx = prev?.vx ?? (Math.random() - 0.5) * 2;
      const vy = prev?.vy ?? (Math.random() - 0.5) * 2;

      const isBad = Boolean(pn.flagged || pn.known_bad || pn.status === "FLAGGED");
      const isFrozen = Boolean(pn.frozen || pn.status === "FROZEN");

      return {
        ...pn,
        x,
        y,
        vx,
        vy,
        radius: isBad || isFrozen ? 38 : 32,
        isBad,
        isFrozen,
        isDragging: false,
      };
    });

    const nodeMap = new Map();
    newNodes.forEach((n) => nodeMap.set(n.id, n));

    // Valid edges
    const validEdges = parsedEdges
      .filter((e) => nodeMap.has(e.source) && nodeMap.has(e.target))
      .map((e) => ({
        ...e,
        sourceNode: nodeMap.get(e.source),
        targetNode: nodeMap.get(e.target),
        weight: e.throughput || 50,
      }));

    // Seed packet particles along edges
    const newParticles = [];
    validEdges.forEach((e) => {
      const packetCount = Math.max(1, Math.min(4, Math.floor((e.weight || 50) / 35)));
      for (let p = 0; p < packetCount; p++) {
        newParticles.push({
          edge: e,
          t: (p / packetCount + Math.random() * 0.2) % 1.0,
          speed: 0.005 + (e.weight / 100) * 0.006,
          size: e.risk === "CRITICAL" || e.risk === "HIGH" ? 3.5 : 2.5,
          color:
            e.risk === "CRITICAL"
              ? THEME.neonDanger
              : e.risk === "HIGH"
              ? THEME.neonAmber
              : THEME.neonGreen,
        });
      }
    });

    sim.nodes = newNodes;
    sim.edges = validEdges;
    sim.particles = newParticles;
    sim.nodeMap = nodeMap;
    sim.layoutTargetMap = computeLayoutTargets(width, height);
  }, [parsedNodes, parsedEdges, computeLayoutTargets]);

  // Update layout targets whenever layout mode or size changes
  useEffect(() => {
    const sim = simRef.current;
    sim.layoutTargetMap = computeLayoutTargets(sim.width, sim.height);
  }, [activeLayout, computeLayoutTargets]);

  // ============================================================================
  // PHYSICS SIMULATION ENGINE & ANIMATION LOOP
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const renderLoop = (timestamp) => {
      if (!isRunning) return;

      const sim = simRef.current;
      const { width, height, dpr, nodes, edges, particles, camera } = sim;

      // Calculate frame rate
      if (sim.fpsTimer === 0) {
        sim.fpsTimer = timestamp;
      }
      sim.frameCount++;
      if (timestamp - sim.fpsTimer >= 500) {
        const measuredFps = Math.round(
          (sim.frameCount * 1000) / (timestamp - sim.fpsTimer)
        );
        if (fpsSpanRef.current) {
          fpsSpanRef.current.textContent = String(measuredFps);
        }
        sim.frameCount = 0;
        sim.fpsTimer = timestamp;
      }

      // Shockwave ring pulsation progress
      sim.shockwaveRadius = (sim.shockwaveRadius + 0.6) % 55;

      // ----------------------------------------------------------------------
      // 1. PHYSICS UPDATE STEP
      // ----------------------------------------------------------------------
      if (isPhysicsRunning && nodes.length > 0) {
        if (activeLayout === "fruchterman-reingold") {
          // Classic Fruchterman-Reingold Spring Layout
          // Area A = W * H, optimal distance k = C * sqrt(A / |V|)
          const area = Math.max(width * height, 250000);
          const kDistance = Math.min(110, Math.max(70, 0.42 * Math.sqrt(area / (nodes.length || 1))));
          const kDistSq = kDistance * kDistance;
          const centerGravityK = 0.085;
          const centerX = width / 2;
          const centerY = height / 2;

          // Coulomb Repulsion: F_r ∝ k² / d
          for (let i = 0; i < nodes.length; i++) {
            const u = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
              const v = nodes[j];
              const dx = u.x - v.x;
              const dy = u.y - v.y;
              const distSq = dx * dx + dy * dy;
              const dist = Math.max(Math.sqrt(distSq), 1.0);

              // Repulsive force magnitude
              const force = (kDistSq / dist) * 0.08;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;

              if (!u.isDragging) {
                u.vx += fx;
                u.vy += fy;
              }
              if (!v.isDragging) {
                v.vx -= fx;
                v.vy -= fy;
              }
            }
          }

          // Hooke Attraction: F_a = k * Δx along edges
          edges.forEach((edge) => {
            const u = edge.sourceNode;
            const v = edge.targetNode;
            if (!u || !v) return;

            const dx = v.x - u.x;
            const dy = v.y - u.y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1.0);

            // Hooke spring attraction
            const force = ((dist * dist) / kDistance) * 0.0035;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!u.isDragging) {
              u.vx += fx;
              u.vy += fy;
            }
            if (!v.isDragging) {
              v.vx -= fx;
              v.vy -= fy;
            }
          });

          // Center Gravity & 0.82 Velocity Damping
          nodes.forEach((node) => {
            if (node.isDragging) return;

            // Weak restorative pull toward canvas center
            const gdx = centerX - node.x;
            const gdy = centerY - node.y;
            node.vx += gdx * centerGravityK * 0.08;
            node.vy += gdy * centerGravityK * 0.08;

            // Velocity damping factor: exactly 0.82
            node.vx *= 0.82;
            node.vy *= 0.82;

            // Cap maximum displacement to prevent numerical instability
            const maxDisplacement = 18;
            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            if (speed > maxDisplacement) {
              node.vx = (node.vx / speed) * maxDisplacement;
              node.vy = (node.vy / speed) * maxDisplacement;
            }

            node.x += node.vx;
            node.y += node.vy;
          });
        } else {
          // Guided Layout Mode (Kahn 4-Tier DAG or Concentric Shockwave)
          // Smooth spring lerp toward target anchor coordinates
          const lerpFactor = 0.12;
          nodes.forEach((node) => {
            if (node.isDragging) return;
            const target = sim.layoutTargetMap.get(node.id);
            if (target) {
              node.x += (target.x - node.x) * lerpFactor;
              node.y += (target.y - node.y) * lerpFactor;
              node.vx = 0;
              node.vy = 0;
            }
          });
        }
      }

      // Update Edge Traffic Particles
      if (particlesEnabled) {
        particles.forEach((p) => {
          p.t = (p.t + p.speed * particleSpeed) % 1.0;
        });
      }

      // ----------------------------------------------------------------------
      // 2. CANVAS DRAWING STEP
      // ----------------------------------------------------------------------
      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Background Obsidian Fill
      ctx.fillStyle = THEME.bg;
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid Dots & Fine Mesh
      ctx.save();
      const gridSize = 32 * camera.k;
      const offsetX = camera.x % gridSize;
      const offsetY = camera.y % gridSize;
      ctx.strokeStyle = THEME.gridLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = offsetX; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      ctx.restore();

      // Camera transformation
      ctx.save();
      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.k, camera.k);

      // Background Layout Guides (Tiers or Shockwave Rings)
      if (activeLayout === "kahn-dag") {
        // Draw 4 Tier Lane Dividers and Headers
        const leftMargin = width * 0.14;
        const rightMargin = width * 0.86;
        const colSpacing = (rightMargin - leftMargin) / 3;

        for (let t = 0; t < 4; t++) {
          const colX = leftMargin + t * colSpacing;
          const tierInfo = THEME.tierColors[t];

          // Subtle column background glow
          ctx.fillStyle = tierInfo.fill;
          ctx.globalAlpha = 0.22;
          ctx.fillRect(colX - colSpacing * 0.44, 40, colSpacing * 0.88, height - 80);
          ctx.globalAlpha = 1.0;

          // Vertical guideline
          ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.moveTo(colX, 30);
          ctx.lineTo(colX, height - 30);
          ctx.stroke();
          ctx.setLineDash([]);

          // Column Tier Label
          ctx.font = "bold 10px monospace";
          ctx.fillStyle = tierInfo.border;
          ctx.textAlign = "center";
          ctx.fillText(`TIER ${t}: ${tierInfo.label}`, colX, 28);
        }
      } else if (activeLayout === "shockwave") {
        // Draw Concentric Blast-Radius Guide Rings
        const epicenter =
          sim.nodeMap.get(activeEpicenterId) ||
          nodes[0] || { x: width / 2, y: height / 2 };
        const rings = [
          { r: 140, label: "HOP 1: BLAST RADIUS", color: "rgba(255, 51, 102, 0.35)" },
          { r: 260, label: "HOP 2: SECONDARY CONTAGION", color: "rgba(245, 158, 11, 0.25)" },
          { r: 370, label: "HOP 3+: PERIPHERAL EXPOSURE", color: "rgba(0, 255, 102, 0.15)" },
        ];

        rings.forEach(({ r, label, color }) => {
          ctx.beginPath();
          ctx.arc(epicenter.x, epicenter.y, r, 0, 2 * Math.PI);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Radial label
          ctx.font = "9px monospace";
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.fillText(label, epicenter.x, epicenter.y - r - 6);
        });
      }

      // Draw Edges
      edges.forEach((edge) => {
        const u = edge.sourceNode;
        const v = edge.targetNode;
        if (!u || !v) return;

        const isIncidentToSelected =
          internalSelectedId &&
          (u.id === internalSelectedId || v.id === internalSelectedId);
        const isHighlighted =
          highlightedEdgeIds.includes(edge.id) || isIncidentToSelected;
        const isDimmed =
          internalSelectedId && !isIncidentToSelected;

        ctx.beginPath();
        ctx.moveTo(u.x, u.y);
        ctx.lineTo(v.x, v.y);

        if (isHighlighted) {
          ctx.strokeStyle = edge.risk === "CRITICAL" ? THEME.edgeDanger : THEME.edgeHighlighted;
          ctx.lineWidth = 2.5;
          ctx.shadowColor =
            edge.risk === "CRITICAL" ? THEME.neonDangerGlow : THEME.neonGreenGlow;
          ctx.shadowBlur = 12;
        } else if (isDimmed) {
          ctx.strokeStyle = THEME.edgeDimmed;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle =
            edge.risk === "CRITICAL"
              ? "rgba(255, 51, 102, 0.4)"
              : THEME.edgeNormal;
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // reset

        // Edge Direction Arrow
        const dx = v.x - u.x;
        const dy = v.y - u.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 30) {
          const arrowDist = dist - v.radius - 8;
          const arrowX = u.x + (dx / dist) * arrowDist;
          const arrowY = u.y + (dy / dist) * arrowDist;
          const angle = Math.atan2(dy, dx);
          const arrowSize = isHighlighted ? 6 : 4.5;

          ctx.save();
          ctx.translate(arrowX, arrowY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-arrowSize * 1.5, -arrowSize * 0.7);
          ctx.lineTo(-arrowSize * 1.5, arrowSize * 0.7);
          ctx.closePath();
          ctx.fillStyle = isHighlighted
            ? edge.risk === "CRITICAL"
              ? THEME.neonDanger
              : THEME.neonGreen
            : "rgba(255, 255, 255, 0.35)";
          ctx.fill();
          ctx.restore();
        }
      });

      // Draw Edge Traffic Particles (Packets)
      if (particlesEnabled) {
        particles.forEach((p) => {
          const u = p.edge.sourceNode;
          const v = p.edge.targetNode;
          if (!u || !v) return;

          const isIncident =
            internalSelectedId &&
            (u.id === internalSelectedId || v.id === internalSelectedId);

          const px = u.x + (v.x - u.x) * p.t;
          const py = u.y + (v.y - u.y) * p.t;

          // Motion tail
          const tailT = Math.max(0, p.t - 0.04);
          const tx = u.x + (v.x - u.x) * tailT;
          const ty = u.y + (v.y - u.y) * tailT;

          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(px, py);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = isIncident ? p.size * 1.4 : p.size * 0.8;
          ctx.globalAlpha = 0.45;
          ctx.stroke();

          // Packet head glow
          ctx.beginPath();
          ctx.arc(px, py, isIncident ? p.size * 1.3 : p.size, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 1.0;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = isIncident ? 14 : 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Draw Nodes
      nodes.forEach((node) => {
        const isSelected = internalSelectedId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isHighlighted = highlightedNodeIds.includes(node.id);
        const isEpicenter = activeLayout === "shockwave" && node.id === activeEpicenterId;

        // Animated Concentric Shockwave Rings for Flagged / Frozen / Bad Nodes
        if (node.isBad || node.isFrozen || isEpicenter) {
          const waveColor = node.isFrozen
            ? THEME.neonCyan
            : node.isBad
            ? THEME.neonDanger
            : THEME.neonGreen;

          for (let w = 0; w < 3; w++) {
            const currentR = node.radius + ((sim.shockwaveRadius + w * 18) % 54);
            const alpha = Math.max(0, 1 - (currentR - node.radius) / 54) * 0.75;

            ctx.beginPath();
            ctx.arc(node.x, node.y, currentR, 0, 2 * Math.PI);
            ctx.strokeStyle = waveColor;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }

        // Selection & Hover Halos
        if (isSelected || isHovered || isHighlighted) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 7, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected
            ? "rgba(0, 255, 102, 0.25)"
            : "rgba(255, 255, 255, 0.12)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 7, 0, 2 * Math.PI);
          ctx.strokeStyle = isSelected ? THEME.neonGreen : "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 2;
          ctx.shadowColor = isSelected ? THEME.neonGreenGlow : "rgba(255, 255, 255, 0.5)";
          ctx.shadowBlur = 16;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Main Node Body (Frosted Obsidian Disk)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);

        // Radial Specular Fill Gradient
        const grad = ctx.createRadialGradient(
          node.x - node.radius * 0.35,
          node.y - node.radius * 0.35,
          node.radius * 0.1,
          node.x,
          node.y,
          node.radius
        );

        if (node.isFrozen) {
          grad.addColorStop(0, "rgba(6, 182, 212, 0.45)");
          grad.addColorStop(0.7, "#081b24");
          grad.addColorStop(1, "#040b10");
        } else if (node.isBad) {
          grad.addColorStop(0, "rgba(255, 51, 102, 0.5)");
          grad.addColorStop(0.7, "#200a12");
          grad.addColorStop(1, "#0a0406");
        } else {
          grad.addColorStop(0, "rgba(0, 255, 102, 0.25)");
          grad.addColorStop(0.7, "#091410");
          grad.addColorStop(1, "#030805");
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Node Rim Border (Specular Neon Highlight)
        ctx.strokeStyle = node.isFrozen
          ? THEME.neonCyan
          : node.isBad
          ? THEME.neonDanger
          : THEME.neonGreen;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        if (isSelected || node.isBad || node.isFrozen) {
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 10;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Node Icon Glyph / Type Indicator
        const typeInfo = THEME.nodeTypes[node.label] || { glyph: "●", color: "#fff" };
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(typeInfo.glyph, node.x, node.y - 1);

        // Node Name & Tag Label
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = isSelected ? THEME.neonGreen : THEME.textPrimary;
        ctx.shadowColor = isSelected ? THEME.neonGreenGlow : "rgba(0,0,0,0.8)";
        ctx.shadowBlur = isSelected ? 8 : 4;

        const displayName = node.name || node.id;
        const truncated =
          displayName.length > 22
            ? displayName.substring(0, 20) + ".."
            : displayName;
        ctx.fillText(truncated, node.x, node.y + node.radius + 6);

        // Badge Status Sub-label
        if (node.isBad || node.isFrozen) {
          const statusText = node.isFrozen ? "FROZEN" : "FLAGGED";
          ctx.font = "bold 10px monospace";
          ctx.fillStyle = node.isFrozen ? THEME.neonCyan : THEME.neonDanger;
          ctx.fillText(statusText, node.x, node.y + node.radius + 20);
        }
        ctx.shadowBlur = 0;
      });

      // Restore camera & canvas state
      ctx.restore();
      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [
    activeLayout,
    isPhysicsRunning,
    particlesEnabled,
    particleSpeed,
    internalSelectedId,
    hoveredNodeId,
    highlightedNodeIds,
    highlightedEdgeIds,
    activeEpicenterId,
  ]);

  // ============================================================================
  // RESIZE OBSERVER (Responsive Canvas Scaling & Retina DPI)
  // ============================================================================
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.floor(rect.width) || 800;
      const height = Math.floor(rect.height) || 600;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      const sim = simRef.current;
      sim.width = width;
      sim.height = height;
      sim.dpr = dpr;
      sim.layoutTargetMap = computeLayoutTargets(width, height);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [computeLayoutTargets]);

  // ============================================================================
  // INTERACTIVE POINTER EVENTS (Zoom, Pan, Drag, Click, Hover)
  // ============================================================================
  // Convert screen coordinates to simulation world coordinates
  const screenToWorld = useCallback((screenX, screenY) => {
    const sim = simRef.current;
    const { camera } = sim;
    return {
      x: (screenX - camera.x) / camera.k,
      y: (screenY - camera.y) / camera.k,
    };
  }, []);

  // Find node under pointer
  const getNodeAt = useCallback(
    (worldX, worldY, hitMargin = 8) => {
      const sim = simRef.current;
      for (let i = sim.nodes.length - 1; i >= 0; i--) {
        const node = sim.nodes[i];
        const dx = worldX - node.x;
        const dy = worldY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) <= node.radius + hitMargin) {
          return node;
        }
      }
      return null;
    },
    []
  );

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);
    const hitNode = getNodeAt(worldPos.x, worldPos.y);

    const sim = simRef.current;

    if (hitNode) {
      // Begin node dragging
      hitNode.isDragging = true;
      sim.dragState = {
        isDraggingNode: true,
        nodeId: hitNode.id,
        startX: screenX,
        startY: screenY,
        nodeStartX: hitNode.x,
        nodeStartY: hitNode.y,
        hasMoved: false,
      };
      canvas.setPointerCapture(e.pointerId);
    } else {
      // Begin canvas panning
      sim.dragState = {
        isPanning: true,
        startX: screenX,
        startY: screenY,
        camStartX: sim.camera.x,
        camStartY: sim.camera.y,
        hasMoved: false,
      };
      canvas.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const sim = simRef.current;
    const dragState = sim.dragState;

    if (dragState?.isDraggingNode) {
      dragState.hasMoved = true;
      const worldPos = screenToWorld(screenX, screenY);
      const node = sim.nodeMap.get(dragState.nodeId);
      if (node) {
        node.x = worldPos.x;
        node.y = worldPos.y;
        node.vx = 0;
        node.vy = 0;
      }
    } else if (dragState?.isPanning) {
      dragState.hasMoved = true;
      const dx = screenX - dragState.startX;
      const dy = screenY - dragState.startY;
      sim.camera.x = dragState.camStartX + dx;
      sim.camera.y = dragState.camStartY + dy;
    } else {
      // Hover detection
      const worldPos = screenToWorld(screenX, screenY);
      const hit = getNodeAt(worldPos.x, worldPos.y);
      setHoveredNodeId(hit ? hit.id : null);
      canvas.style.cursor = hit ? "pointer" : "default";
    }
  };

  const handlePointerUp = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sim = simRef.current;
    const dragState = sim.dragState;

    if (dragState) {
      if (dragState.isDraggingNode) {
        const node = sim.nodeMap.get(dragState.nodeId);
        if (node) {
          node.isDragging = false;
        }

        // If it was a quick click without significant drag, trigger select
        if (!dragState.hasMoved) {
          handleNodeSelection(dragState.nodeId);
        }
      } else if (dragState.isPanning && !dragState.hasMoved) {
        // Clicked background -> deselect
        handleNodeSelection(null);
      }

      sim.dragState = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {
        // Ignore if pointer capture wasn't held
      }
    }
  };

  // Cursor-anchored wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const sim = simRef.current;
    const { camera } = sim;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newK = Math.min(4.0, Math.max(0.18, camera.k * zoomFactor));

    // Keep world coordinate under pointer fixed
    camera.x = screenX - (screenX - camera.x) * (newK / camera.k);
    camera.y = screenY - (screenY - camera.y) * (newK / camera.k);
    camera.k = newK;
  };

  // Node selection handler
  const handleNodeSelection = (nodeId) => {
    setInternalSelectedId(nodeId);
    if (onNodeClick) {
      const selectedNode = nodeId ? simRef.current.nodeMap.get(nodeId) : null;
      onNodeClick(selectedNode);
    }
  };

  // Reset / Fit-to-screen camera handler
  const handleResetCamera = () => {
    const sim = simRef.current;
    sim.camera = { x: 0, y: 0, k: 1.0 };
  };

  // Export Canvas snapshot as PNG
  const handleExportSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `sengra-graph-${activeLayout}-${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  // Selected node metadata
  const selectedNodeData = useMemo(() => {
    if (!internalSelectedId) return null;
    return parsedNodes.find((n) => n.id === internalSelectedId) || null;
  }, [internalSelectedId, parsedNodes]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#040608] select-none ${className}`}
    >
      {/* HTML5 Canvas Rendering Surface */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="absolute inset-0 block touch-none"
      />

      {/* ====================================================================
          TOP LIQUID GLASS HUD TOOLBAR
          ==================================================================== */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        {/* Layout Engine Switcher */}
        <div className="liquid-glass-elevated px-2 py-1.5 rounded-lg flex items-center gap-1.5 pointer-events-auto shadow-2xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 px-2">
            LAYOUT:
          </span>

          {/* Fruchterman-Reingold Spring */}
          <button
            type="button"
            onClick={() => setActiveLayout("fruchterman-reingold")}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
              activeLayout === "fruchterman-reingold"
                ? "bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/40 shadow-[0_0_12px_rgba(0,255,102,0.25)] font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
            }`}
            title="Coulomb repulsion + Hooke attraction + 0.82 velocity damping"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
            Fruchterman-Reingold
          </button>

          {/* 4-Tier Kahn DAG */}
          <button
            type="button"
            onClick={() => setActiveLayout("kahn-dag")}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
              activeLayout === "kahn-dag"
                ? "bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
            }`}
            title="Topological DAG pipeline: APIs -> Adapters -> Workflows -> Databases"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
            4-Tier Kahn DAG
          </button>

          {/* Concentric Shockwave Blast Radius */}
          <button
            type="button"
            onClick={() => setActiveLayout("shockwave")}
            className={`px-2.5 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
              activeLayout === "shockwave"
                ? "bg-[#ff3366]/15 text-[#ff3366] border border-[#ff3366]/40 shadow-[0_0_12px_rgba(255,51,102,0.25)] font-semibold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent"
            }`}
            title="Concentric blast-radius rings radiating from fraud epicenter"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3366]" />
            Concentric Shockwave
          </button>
        </div>

        {/* Engine Controls & Actions */}
        <div className="liquid-glass px-2 py-1.5 rounded-lg flex items-center gap-2 pointer-events-auto">
          {/* Edge Traffic Toggle */}
          <button
            type="button"
            onClick={() => setParticlesEnabled(!particlesEnabled)}
            className={`px-2 py-1 text-xs font-mono rounded border transition-colors flex items-center gap-1.5 ${
              particlesEnabled
                ? "border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title="Toggle live packet throughput flow"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                particlesEnabled ? "bg-[#00ff66] animate-pulse" : "bg-zinc-600"
              }`}
            />
            Traffic Flow
          </button>

          {/* Physics Play/Pause */}
          <button
            type="button"
            onClick={() => setIsPhysicsRunning(!isPhysicsRunning)}
            className="px-2 py-1 text-xs font-mono rounded border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
            title="Toggle physics simulation engine"
          >
            {isPhysicsRunning ? "⏸ Pause" : "▶ Simulate"}
          </button>

          {/* Reset Zoom */}
          <button
            type="button"
            onClick={handleResetCamera}
            className="px-2 py-1 text-xs font-mono rounded border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
            title="Reset Pan & Zoom"
          >
            Fit View
          </button>

          {/* Snapshot PNG */}
          <button
            type="button"
            onClick={handleExportSnapshot}
            className="px-2 py-1 text-xs font-mono rounded border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-[#00ff66]/40 hover:text-[#00ff66] transition-colors"
            title="Export high-resolution canvas snapshot"
          >
            Snapshot
          </button>
        </div>
      </div>

      {/* ====================================================================
          BOTTOM METRICS & STATUS HUD
          ==================================================================== */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none z-20">
        <div className="liquid-glass px-3 py-1.5 rounded-lg flex items-center gap-4 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
            <span className="text-zinc-500">FPS:</span>
            <span ref={fpsSpanRef} className="text-[#00ff66] font-bold">60</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-zinc-500">NODES:</span>
            <span className="text-zinc-200">{parsedNodes.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-zinc-500">EDGES:</span>
            <span className="text-zinc-200">{parsedEdges.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-zinc-500">THROUGHPUT:</span>
            <span className="text-[#00ff66]">
              {particlesEnabled ? `${estimatedPacketsCount * 8} pkts/s` : "IDLE"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-zinc-500">DAMPING:</span>
            <span className="text-zinc-300">0.82v</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SELECTED NODE INSPECTOR DRAWER (Liquid Glass Card)
          ==================================================================== */}
      {selectedNodeData && (
        <div className="absolute top-16 right-3 w-80 liquid-glass-elevated rounded-xl p-4 z-30 pointer-events-auto border border-white/15 shadow-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-300 mr-2">
                {selectedNodeData.label || "NODE"}
              </span>
              {selectedNodeData.isBad && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#ff3366]/40 bg-[#ff3366]/10 text-[#ff3366] font-bold">
                  FLAGGED THREAT
                </span>
              )}
              {selectedNodeData.isFrozen && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[#06b6d4]/40 bg-[#06b6d4]/10 text-[#06b6d4] font-bold ml-1">
                  FROZEN
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleNodeSelection(null)}
              className="text-zinc-500 hover:text-zinc-200 text-xs px-1 font-mono"
            >
              ✕
            </button>
          </div>

          <h3 className="text-sm font-bold text-white font-mono mb-1 truncate">
            {selectedNodeData.name || selectedNodeData.id}
          </h3>
          <p className="text-[11px] font-mono text-zinc-500 mb-3 truncate">
            ID: {selectedNodeData.id}
          </p>

          {/* Node Attributes Table */}
          <div className="space-y-1.5 border-t border-zinc-800/80 pt-2 mb-3 text-xs font-mono">
            {selectedNodeData.riskScore && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Risk Score:</span>
                <span className="text-[#ff3366] font-bold">
                  {selectedNodeData.riskScore}/100
                </span>
              </div>
            )}
            {selectedNodeData.balance && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Ledger Balance:</span>
                <span className="text-[#00ff66] font-semibold">
                  {selectedNodeData.balance}
                </span>
              </div>
            )}
            {typeof selectedNodeData.tier === "number" && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Kahn Tier:</span>
                <span className="text-cyan-400">Tier {selectedNodeData.tier}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => setActiveLayout("shockwave")}
              className="px-2 py-1.5 text-[11px] font-mono rounded bg-white/5 hover:bg-[#00ff66]/15 hover:text-[#00ff66] border border-white/10 text-zinc-300 transition-colors"
            >
              Set Epicenter
            </button>
            <button
              type="button"
              className="px-2 py-1.5 text-[11px] font-mono rounded bg-[#ff3366]/10 hover:bg-[#ff3366]/20 border border-[#ff3366]/30 text-[#ff3366] transition-colors"
            >
              Freeze Account
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          SVG GLASSSCOPE REFRACTION FILTERS
          ==================================================================== */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          {/* GlassScope Refraction Filter */}
          <filter id="glass-scope-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Chromatic Aberration Filter */}
          <filter id="chromatic-aberration-filter">
            <feOffset in="SourceGraphic" dx="2" dy="0" result="red" />
            <feOffset in="SourceGraphic" dx="-2" dy="0" result="cyan" />
            <feBlend mode="screen" in="red" in2="cyan" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
