# Platform Engineering Review

Use this prompt to understand how a repository fits into a wider platform ecosystem.

```text
Act as a platform architect.

Analyze how this repository fits within a platform ecosystem.

Explain:

- service responsibilities
- platform dependencies
- deployment architecture
- observability integration
- configuration management
- runtime environment

Output format:

1. Platform alignment summary
2. Gaps by area (deployment, runtime, observability, config, dependencies)
3. Risks and impact
4. Prioritized alignment actions
5. `Context request to user` (only if critical context is missing)

Rules:

- Recommend improvements for platform alignment with evidence.
- Separate quick wins from structural changes.
- If platform details are missing, write `Not found in repository`.
- If critical platform context is outside this repository, add a `Context request to user` section with concrete fields.
```
