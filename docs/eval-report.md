# SENGRA — Quantitative Evaluation & Benchmark Report

> Rigorous comparison of Graph-Native Multi-Hop Intelligence vs Legacy Flat-Table Heuristics

---

## 1. Executive Summary

To measure the empirical advantage of graph-native fraud detection, SENGRA includes a standardized offline benchmark suite (`pnpm eval`) evaluating **22 planted accounts** representing diverse financial crime typologies and legitimate customer behaviors.

### Headline Results

| Metric | SENGRA Graph Agent | Flat-Table Baseline | Advantage / Delta |
|---|---|---|---|
| **Precision** | **100.0%** | 54.5% | **+45.5%** |
| **Recall (Sensitivity)** | **100.0%** | 50.0% | **+50.0%** |
| **F1 Score** | **1.000** | 0.522 | **+0.478** |
| **False Positive Rate (FPR)** | **0.0%** | 50.0% | **-50.0%** |
| **Overall Accuracy** | **100.0%** | 50.0% | **+50.0%** |

> **Conclusion**: SENGRA graph intelligence outperforms traditional tabular heuristics by well over the $>25\%$ required margin across both precision and recall, completely eliminating false positive freezes on benign family clusters while achieving $100\%$ interception on multi-hop mule syndicates.

---

## 2. Confusion Matrix Comparison

### SENGRA Graph Agent
$$\begin{pmatrix} \text{TP} = 12 & \text{FP} = 0 \\ \text{FN} = 0 & \text{TN} = 10 \end{pmatrix}$$
- **12 True Positives**: Successfully intercepted 8 Ring A mule accounts and 4 Ring C account takeovers.
- **10 True Negatives**: Successfully cleared 5 Ring B benign family accounts and 5 clean background accounts.
- **0 False Positives**: Zero innocent customers frozen.
- **0 False Negatives**: Zero fraudulent accounts missed.

### Flat-Table Baseline (Legacy SQL Rules)
$$\begin{pmatrix} \text{TP} = 6 & \text{FP} = 5 \\ \text{FN} = 6 & \text{TN} = 5 \end{pmatrix}$$
- **5 False Positives**: Blindly frozen innocent family members because shared IP/address count exceeded naive threshold $\ge 3$.
- **6 False Negatives**: Completely missed collector mules and layering accounts because the direct devices attached to them had no prior fraud flags.

---

## 3. Failure Mode Deep Dive

### Failure Mode 1: False Positives on Benign Family Clusters (Ring B)
* **The Tabular Blindspot**: Single-table SQL rules count entity associations in isolation:
  ```sql
  SELECT account_id FROM accounts WHERE shared_ip_count >= 3 OR shared_address_count >= 3;
  ```
  This heuristic flags legitimate households where parents and children share a home router and residence.
* **The Graph-Native Solution**: SENGRA's proactive **Skeptic Challenge** inspects the topological neighborhood:
  - Confirms zero known-bad devices in the sub-network.
  - Confirms linear, non-circular money flows.
  - Verifies residential ISP origin and normal transaction velocity.
  - Result: Account cleared without customer support friction.

### Failure Mode 2: False Negatives on Collector Mules (Ring A)
* **The Tabular Blindspot**: Sophisticated fraud syndicates use layering. Account A logs in from bad device D-17, transfers funds to Account B, who transfers funds to Collector Mule C (logging in from clean device D-18). A flat-table query inspecting Mule C sees zero bad device associations:
  ```sql
  SELECT is_bad FROM devices WHERE device_id = 'D-18'; -- Returns FALSE
  ```
* **The Graph-Native Solution**: SENGRA executes multi-hop traversals:
  ```cypher
  MATCH (a:Account {id: $id})-[:USES|TRANSFERRED_TO*1..2]-(d:Device {known_bad: true})
  RETURN d.id
  ```
  The 2-hop topological proximity triggers **Rule F4**, freezing the collector mule before stolen funds can be laundered off-platform.

---

## 4. Reproducing the Benchmark

To run this evaluation benchmark deterministically on any machine:

```bash
pnpm eval
```

Or view the interactive visualizer in your browser at `http://localhost:3000/compare`.
