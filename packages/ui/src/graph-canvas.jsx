/**
 * @file packages/ui/src/graph-canvas.jsx
 * @description Interactive React Cytoscape.js canvas component for graph fraud ring exploration.
 */

"use client";

import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { CYTOSCAPE_STYLESHEET } from "./styles.js";

/**
 * Interactive Cytoscape graph canvas.
 *
 * @param {object} props
 * @param {Array<object>} props.elements - Cytoscape elements (nodes & edges)
 * @param {string} [props.layoutName] - Layout algorithm ("concentric", "breadthfirst", "cose", "circle")
 * @param {Function} [props.onNodeClick] - Callback when node is clicked
 * @param {Array<string>} [props.highlightedNodeIds] - Node IDs to highlight
 * @param {string} [props.className] - CSS class names
 */
export function GraphCanvas({
  elements = [],
  layoutName = "concentric",
  onNodeClick,
  highlightedNodeIds = [],
  className = "w-full h-full",
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: CYTOSCAPE_STYLESHEET,
      layout: {
        name: layoutName,
        animate: true,
        animationDuration: 500,
        fit: true,
        padding: 40,
      },
      minZoom: 0.2,
      maxZoom: 3.0,
      wheelSensitivity: 0.2,
    });

    cy.on("tap", "node", (evt) => {
      const node = evt.target;
      if (onNodeClick) {
        onNodeClick(node.data());
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  // Update elements and layout when props change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().remove();
      cy.add(elements);
    });

    cy.layout({
      name: layoutName,
      animate: true,
      animationDuration: 400,
      fit: true,
      padding: 40,
    }).run();
  }, [elements, layoutName]);

  // Handle path / node highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.nodes().removeClass("highlighted");
    if (highlightedNodeIds && highlightedNodeIds.length > 0) {
      for (const id of highlightedNodeIds) {
        const node = cy.getElementById(id);
        if (node) {
          node.addClass("highlighted");
        }
      }
    }
  }, [highlightedNodeIds]);

  return (
    <div className={`relative bg-zinc-950 overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}

export default GraphCanvas;
