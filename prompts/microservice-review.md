# Microservice Review

Use this prompt when the repository represents a service inside a distributed landscape.

```text
Act as a distributed systems architect.

Evaluate this repository as a microservice.

Assess:

- service boundaries
- domain ownership
- API design
- data ownership
- coupling with other services
- resilience and fault tolerance
- scalability model

Output format:

1. Service boundary and ownership assessment
2. API/data contract findings
3. Coupling and resilience findings
4. Top risks (prioritized)
5. Recommended improvements (safe sequence)
6. `Context request to user` (only if critical context is missing)

Rules:

- Suggest improvements with evidence from the implementation.
- Highlight contract risks and cross-service dependency risks explicitly.
- If something cannot be confirmed, write `Not found in repository`.
- If critical context is missing (for example upstream/downstream contracts in other repositories), add a `Context request to user` section.
```
