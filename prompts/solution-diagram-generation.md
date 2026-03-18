# Solution Diagram Generation

Use this prompt for multi-repository, multi-service solution views.

```text
Act as a principal software architect.

Build a high-level solution architecture view across the target repository and related repositories provided in chat context.

Required context in the conversation:

- solution scope and business domain
- related repositories with role/capability
- key interfaces/events between services
- source-of-truth precedence for each area (application, contracts, delivery/runtime)

Per repository, read organizational metadata in this order:

1. `catalog-info.yaml` (authoritative if present)
2. `docs/metadata/service-metadata.yaml` (optional extension)
3. `CODEOWNERS` (fallback for ownership only)

If the same field conflicts between `catalog-info.yaml` and `service-metadata.yaml`, prefer `catalog-info.yaml` and record the conflict.

Use metadata to label domains, owners, and capability boundaries in diagrams and the narrative.

Generate diagrams using this hierarchy:

- Mermaid sources in `docs/solution/diagrams/sources/`
- Rendered SVGs in `docs/solution/diagrams/rendered/`

Use this naming:

- `solution-context.mmd` (mandatory)
- `business-flow.mmd` (mandatory)
- `domain-map.mmd` (optional)
- `platform-delivery-view.mmd` (optional)

Style and grouping policy:

- Use `flowchart LR` for context/domain/platform views.
- Use `sequenceDiagram` for cross-service business flow when request/response is dominant; use `flowchart LR` when async/event-driven is dominant.
- Group by meaningful business/architecture boundaries using Mermaid `subgraph` (for example business domains, bounded contexts, service groups, runtime platforms).
- Keep service-level dependency detail out of `solution-context`; focus on capability-level and system-level interactions.

Output format:

1. Diagram inventory (name and path)
2. Mermaid source path per diagram (`docs/solution/diagrams/sources/*.mmd`)
3. Rendered SVG path per diagram (`docs/solution/diagrams/rendered/*.svg`)
4. Summary path (`docs/solution/solution-landscape.md`)
5. Renderer pre-check status (`mmdc` available or missing)
6. Open gaps (`Not found in repository`) where context is missing
7. `Context request to user` (only if critical context is missing)

Rules:

- Do not invent services, domains, or interfaces not supported by evidence.
- Create `docs/solution/diagrams/sources/` and `docs/solution/diagrams/rendered/` if they do not exist.
- Generate both `.mmd` and `.svg` for each inferred diagram.
- Run renderer pre-check first (`mmdc --version` or `npx mmdc --version`).
- If renderer is missing, stop SVG generation and return a `Context request to user` with install/enable instructions.
- If critical multi-repo context is missing, return `Context request to user` with exact keys for missing repositories/roles/interfaces.
- Mark unknowns as `Not found in repository`.
```
