# Lessons Learned

> Semantic memory of failure patterns, root causes, and prevention rules.
> Format: `- [L-xxx] Symptom → Cause → Rule (source: <task>, <failure_id>)`

- `[L-001]` Horizontal rules in markdown sections captured by regex $\rightarrow$ `\S` matched markdown syntax dashes $\rightarrow$ Ensure sections requiring emptiness contain only HTML comments or parentheses without horizontal rule syntax (source: T-0000).
- `[L-002]` Secret scanner regex flags reference strings in prompt.md $\rightarrow$ Prompt documentation contains sample test signatures $\rightarrow$ Exclude specification files from live secret regex scans (source: T-0000).
- `[L-003]` Path guard must combine role allow-list with active lane ownership locks to authorize builders on task-assigned root configuration files (source: T-0000).
