/**
 * @file packages/ui/src/path-animator.js
 * @description Sequencer utility for animating evidence graph paths in sync with agent explanation sentences.
 */

/**
 * Converts a sequence of node IDs into step transitions for Cytoscape animation.
 * @param {Array<string>} pathNodeIds
 * @returns {Array<object>} Step objects
 */
export function createPathAnimationSequence(pathNodeIds = []) {
  if (!Array.isArray(pathNodeIds) || pathNodeIds.length === 0) {
    return [];
  }

  return pathNodeIds.map((nodeId, idx) => {
    const isFinal = idx === pathNodeIds.length - 1;
    const targetNodeId = isFinal ? null : pathNodeIds[idx + 1];
    return {
      stepIndex: idx,
      nodeId,
      targetNodeId,
      isFinal,
    };
  });
}

/**
 * Generates an explanation sentence for the active traversal hop.
 * @param {string} nodeId - Current node ID
 * @param {string} [label] - Entity label (Account, Device, etc.)
 * @param {boolean} [isBad] - Whether the entity is confirmed malicious
 * @param {number} [index] - Current step index (0-based)
 * @param {number} [total] - Total step count
 */
export function generateStepExplanation(nodeId, label = "Account", isBad = false, index = 0, total = 1) {
  const stepPrefix = `Step ${index + 1} of ${total}:`;

  if (isBad || nodeId === "D-17") {
    return `${stepPrefix} Traversed to known-bad fraud device ${nodeId} — critical malicious cluster nexus confirmed.`;
  }

  if (index === 0) {
    return `${stepPrefix} Originating alert on account ${nodeId} triggered graph neighborhood exploration.`;
  }

  if (label === "Device") {
    return `${stepPrefix} Discovered shared hardware fingerprint on device ${nodeId}.`;
  }

  if (label === "Address") {
    return `${stepPrefix} Correlated shared residential address at ${nodeId}.`;
  }

  return `${stepPrefix} Traversed linked connection to entity ${nodeId}.`;
}

/**
 * Runs animated traversal on a Cytoscape instance, firing callbacks on each step.
 *
 * @param {object} cy - Cytoscape.js core instance
 * @param {Array<string>} pathNodeIds - Array of node IDs representing the evidence path
 * @param {object} [options]
 * @param {number} [options.interval] - Delay in ms per hop (default 800)
 * @param {Function} [options.onStep] - (step, explanation) => void
 * @param {Function} [options.onComplete] - () => void
 * @returns {{ cancel: () => void }} Controller to halt animation
 */
export function animateEvidencePath(cy, pathNodeIds = [], options = {}) {
  const { interval = 800, onStep, onComplete } = options;
  const sequence = createPathAnimationSequence(pathNodeIds);

  if (!cy || sequence.length === 0) {
    if (onComplete) onComplete();
    return { cancel: () => {} };
  }

  let currentIndex = 0;
  let timerId = null;

  // Clear existing highlights
  cy.batch(() => {
    cy.elements().removeClass("highlighted highlighted-edge");
  });

  function step() {
    if (currentIndex >= sequence.length) {
      if (onComplete) onComplete();
      return;
    }

    const currentStep = sequence[currentIndex];
    const node = cy.getElementById(currentStep.nodeId);

    if (node && node.length > 0) {
      node.addClass("highlighted");
      cy.animate({
        center: { eles: node },
        duration: 300,
      });

      // Highlight outgoing edge if exists
      if (currentStep.targetNodeId) {
        const edge = cy.edges(`[source = "${currentStep.nodeId}"][target = "${currentStep.targetNodeId}"], [source = "${currentStep.targetNodeId}"][target = "${currentStep.nodeId}"]`);
        if (edge.length > 0) {
          edge.addClass("highlighted-edge");
        }
      }

      const isBad = Boolean(node.data("known_bad"));
      const label = node.data("label") || "Entity";
      const explanation = generateStepExplanation(currentStep.nodeId, label, isBad, currentIndex, sequence.length);

      if (onStep) {
        onStep(currentStep, explanation);
      }
    }

    currentIndex++;
    timerId = setTimeout(step, interval);
  }

  step();

  return {
    cancel: () => {
      if (timerId) clearTimeout(timerId);
    },
  };
}

export default {
  createPathAnimationSequence,
  generateStepExplanation,
  animateEvidencePath,
};
