# Workflow 05: Solution Landscape (Multi-Repo)

## Goal

Build a high-level architecture view across multiple repositories/services with business-level traceability.

## Git stability gate

- preferred: use clean state and pinned refs/branches for each repository in scope
- if local uncommitted context must be included, require explicit `allow_dirty_context=true` and list affected repositories
- if repository refs are ambiguous, stop and return `Context request to user`

## Sequence

1. Start with `Launch recommendations`:
   - suggest missing repository list and role mapping when scope is ambiguous
   - suggest source-of-truth precedence for app behavior, contracts, and delivery/runtime
   - confirm output language if not explicit
   - enforce `Git stability gate` and confirm repository refs
2. Define solution scope (business domain, journey, and analysis boundary).
3. List related repositories and roles in chat context (service role, owned capability, key interfaces/events), and provide `catalog-info.yaml` path per repository (or `docs/metadata/service-metadata.yaml` as extension if present).
4. Define source-of-truth precedence per area (application behavior, contracts, delivery/runtime).
5. Run `prompts/solution-diagram-generation.md`.
6. Generate `docs/solution/solution-landscape.md` using `templates/solution-landscape-template.md`.
7. If deep service-level validation is needed, run `workflows/01-documentation-lifecycle.md` on critical repositories (`mode=baseline` for first run, `mode=update` if docs already exist) and refresh solution diagrams.
8. Create or update `docs/meta.json` using `templates/docs-meta-template.json`.

## Expected outputs

- high-level solution context diagram
- cross-service business flow diagram
- optional domain map and platform delivery view
- solution narrative document linking services, capabilities, and risks
- execution metadata in `docs/meta.json`

## Definition of Done

- `docs/solution/diagrams/sources/solution-context.mmd` and `docs/solution/diagrams/rendered/solution-context.svg` exist.
- `docs/solution/diagrams/sources/business-flow.mmd` and `docs/solution/diagrams/rendered/business-flow.svg` exist.
- `docs/solution/solution-landscape.md` is generated using `templates/solution-landscape-template.md`.
- Organizational metadata is sourced from `catalog-info.yaml` when available across repositories.
- `docs/meta.json` is updated with timestamp, last workflow, updated artifacts, and evidence gaps.
- Unknown or inaccessible cross-repo evidence is marked as `Not found in repository`.

## Artifact path convention

- `docs/solution/diagrams/sources/solution-context.mmd`
- `docs/solution/diagrams/rendered/solution-context.svg`
- `docs/solution/diagrams/sources/business-flow.mmd`
- `docs/solution/diagrams/rendered/business-flow.svg`
- `docs/solution/diagrams/sources/domain-map.mmd` (if applicable)
- `docs/solution/diagrams/rendered/domain-map.svg` (if applicable)
- `docs/solution/diagrams/sources/platform-delivery-view.mmd` (if applicable)
- `docs/solution/diagrams/rendered/platform-delivery-view.svg` (if applicable)
- `docs/solution/solution-landscape.md`
- `docs/meta.json`

## Documentation usage notes

- Use this workflow when one repository alone is not enough to explain the solution.
- Keep the view at business/solution level; avoid overloading it with low-level service internals.
- Keep repository list explicit and minimal to reduce drift and over-inference.
- Pin repository refs (commit/tag/branch) for reproducible solution snapshots.
- Re-run after major cross-service changes or platform re-partitioning.

## Real usage example

A platform architect needs a global view of `checkout`, `pricing`, and `catalog` services to explain the end-to-end buying journey and ownership boundaries.

Prompt execution in this scenario:

1. Define solution scope: `online purchase journey`.
2. Provide repository context for the three services plus contract repo, including `catalog-info.yaml` path per repository.
3. Run `prompts/solution-diagram-generation.md`.
4. Use `templates/solution-landscape-template.md` to capture capability ownership, interfaces, and risks.
5. Run `workflows/01-documentation-lifecycle.md` only on services with unclear boundaries (`mode=baseline` or `mode=update` depending on current docs state).
6. Update `docs/meta.json` with generated solution artifacts and unresolved evidence gaps.

Concrete outputs expected:

- solution context view linking business capabilities and services
- business journey flow across service boundaries
- explicit ownership and risk hotspots

## When not to use this workflow

- when you only need a single service assessment; use `workflows/01-documentation-lifecycle.md`
- when implementing a service-local change request; use `workflows/02-change-request.md`
