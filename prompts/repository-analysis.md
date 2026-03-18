# Repository Analysis

Use this prompt to understand an unknown repository quickly.

```text
Act as a senior software architect.

Analyze this repository strictly based on its actual contents.

Before inferring organizational metadata, check these files in order:

1. `catalog-info.yaml` (authoritative if present)
2. `docs/metadata/service-metadata.yaml` (optional extension for fields not covered in catalog)
3. `CODEOWNERS` (fallback for ownership only)

If values conflict on the same field, prefer `catalog-info.yaml` and record the conflict.

Explain:

- system purpose
- architectural style
- main modules and boundaries
- execution and data flows
- external integrations
- dependency structure
- major risks and technical debt
- maintainability concerns
- organizational metadata found (service, solution/system, domain, area, team, ownership, lifecycle)

Output format:

1. Repository purpose and scope
2. Architecture summary
3. Module boundaries and responsibilities
4. Main flows (request/data/event)
5. Integrations and dependencies
6. Organizational metadata
7. Risks and technical debt
8. Suggested next actions
9. `Context request to user` (only if critical context is missing)

Rules:

- Avoid generic explanations.
- Base conclusions on repository evidence.
- Reference concrete files/directories when possible.
- If something cannot be confirmed, write `Not found in repository`.
- If critical context is missing, add a `Context request to user` section with concrete keys the user can answer in chat.
```
