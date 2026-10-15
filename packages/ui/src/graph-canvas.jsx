/**
 * @file packages/ui/src/graph-canvas.jsx
 * @description Interactive React Cytoscape.js canvas component with synchronized path animation.
 */

"use client";

import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { CYTOSCAPE_STYLESHEET } from "./styles.js";
import { animateEvidencePath } from "./path-animator.js";

/**
 * Interactive Cytoscape graph canvas with animated evidence traversal support.
 *
 * @param {object} props
 * @param {Array<object>} props.elements - Cytoscape elements (nodes & edges)
 * @param {string} [props.layoutName] - Layout algorithm ("concentric", "breadthfirst", "cose", "circle")
 * @param {Function} [props.onNodeClick] - Callback when node is clicked
 * @param {Array<string>} [props.highlightedNodeIds] - Node IDs to highlight
 * @param {Array<string>} [props.animatingPath] - Path to animate sequentially
 * @param {Function} [props.onAnimationStep] - Callback (step, subtitle) during animation
 * @param {Function} [props.onAnimationComplete] - Callback when path animation finishes
 * @param {string} [props.activeSubtitle] - Floating subtitle text to display
 * @param {string} [props.className] - CSS class names
 */
export function GraphCanvas({
  elements = [],
  layoutName = "concentric",
  onNodeClick,
  highlightedNodeIds = [],
  animatingPath = null,
  onAnimationStep,
  onAnimationComplete,
  activeSubtitle = null,
  className = "w-full h-full",
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const animControllerRef = useRef(null);

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
      if (animControllerRef.current) {
        animControllerRef.current.cancel();
      }
      cy.destroy();
    };
  }, []);

  // Update elements and layout when elements change
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

  // Handle static path / node highlighting
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

  // Handle animated path traversal
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !animatingPath || animatingPath.length === 0) return;

    if (animControllerRef.current) {
      animControllerRef.current.cancel();
    }

    animControllerRef.current = animateEvidencePath(cy, animatingPath, {
      interval: 900,
      onStep: onAnimationStep,
      onComplete: onAnimationComplete,
    });

    return () => {
      if (animControllerRef.current) {
        animControllerRef.current.cancel();
      }
    };
  }, [animatingPath]);

  return (
    <div className={`relative bg-zinc-950 overflow-hidden ${className}`}>
      <div ref={containerRef} className="w-full h-full min-h-[400px]" />

      {/* Floating Synchronized Explanation Subtitle Banner */}
      {activeSubtitle && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 max-w-xl px-4 py-2.5 rounded-full border border-cyan-500/50 bg-zinc-900/95 backdrop-blur shadow-[0_0_20px_rgba(6,182,212,0.25)] text-xs font-mono text-cyan-300 text-center animate-fade-in flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span>{activeSubtitle}</span>
        </div>
      )}
    </div>
  );
}

export default GraphCanvas;
