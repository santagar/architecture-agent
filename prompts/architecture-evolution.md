# Architecture Evolution

Use this prompt after the initial repository analysis.

```text
Act as a principal architect.

Based on the repository structure, propose an architectural evolution plan.

Goals:

- improve modularity
- reduce coupling
- increase maintainability
- improve testability
- support scalability

Include:

- current-state constraints
- target architecture direction
- 3-5 incremental change slices
- per-slice risk, validation strategy, and rollback approach
- quality/security hardening opportunities tied to the roadmap

Output format:

1. Current-state constraints
2. Target direction
3. Incremental roadmap (slice by slice)
4. Risk/validation/rollback notes per slice
5. Priority order and rationale
6. `Context request to user` (only if critical context is missing)

Rules:

- Provide a safe incremental roadmap, not a big-bang redesign.
- Prioritize by impact vs risk.
- Base every recommendation on repository evidence.
- If evidence is missing, write `Not found in repository`.
- If critical context is missing for roadmap decisions, add a `Context request to user` section with concrete missing inputs.
```
