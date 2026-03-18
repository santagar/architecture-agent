# Documentation Source of Truth

Use this prompt to generate or update a README that reflects the real repository state.

## Purpose

Use this after repository analysis when engineers need a human-readable source of truth for onboarding, architecture review, maintenance, and change-execution planning.

The output should be an operational README, not marketing text. It should explain how the system is built and operated based only on evidence in the repository.

## When to use

- when the repository has no README and needs one from scratch
- when the existing README is stale or inconsistent with code and configuration
- after meaningful architectural or operational changes

## Assumptions and boundaries

Metadata precedence for organizational fields (owner/team/system/domain/lifecycle):

1. `catalog-info.yaml` (authoritative if present)
2. `docs/metadata/service-metadata.yaml` (optional extension)
3. `CODEOWNERS` (ownership fallback)
4. repository evidence in code/docs

If a field exists in both `catalog-info.yaml` and `service-metadata.yaml`, prefer `catalog-info.yaml`.

The README should:

- describe only what can be verified from repository contents
- call out unknowns explicitly when evidence is missing
- start with service/repository name and a short overview
- include a reference to architecture diagram artifacts when present
- include a reference to solution-level documentation when `docs/solution/solution-landscape.md` exists
- prefer diagram links under `docs/diagrams/sources/` and `docs/diagrams/rendered/` when those artifacts exist
- keep section grouping as defined in `templates/readme-template.md` (`Service snapshot`, `Architecture and system context`, `Build, run, and operate`, `Quality, evolution, and decisions`)

The README should not:

- invent components, environments, integrations, commands, or policies
- assume runtime behavior not supported by repository evidence

```text
Act as a senior software architect documenting a repository for engineers.

Generate a README.md that represents the real current state of this repository.

If README.md exists, update it. If it does not exist, create it from scratch.

Structure the result using `templates/readme-template.md`.

When updating an existing README, reconcile it with all mandatory sections in
the template. If any mandatory section is missing, add it.

For organizational metadata, read and apply this precedence:

1. `catalog-info.yaml`
2. `docs/metadata/service-metadata.yaml`
3. `CODEOWNERS`
4. repository evidence

Include:

- service/repository name and overview
- ownership/status information if present in repository evidence
- prerequisites
- quick start
- architecture and diagram references
- solution landscape reference (when multi-repo solution artifacts exist)
- module responsibilities
- request/data/event flows
- interfaces and integrations
- configuration
- running locally
- testing
- operations
- operational deep dives (when high-value details exist)
- maintenance hotspots
- known limitations
- technical debt status (explicitly `no debt identified` or `debt identified` with report reference and summary)
- technical debt or next improvements
- change execution notes
- preserved operational notes from previous README only when still valid and not mappable to existing sections
- conclusions
- open questions where repository evidence is missing

Output format:

1. Complete `README.md` content following `templates/readme-template.md`
2. Explicit `Not found in repository` markers for missing evidence
3. Diagram references using relative paths when artifacts exist
4. `Context request to user` (only if critical context is missing)

Rules:

- Base everything strictly on repository contents.
- Do not infer undocumented behavior.
- If `README.md` already exists, preserve high-value operational details that remain valid.
- Do not over-compress concrete operational content from previous README versions.
- Preserve concrete thresholds, headers, variable names, commands, and query snippets when supported by repository evidence.
- Prioritize preserving high-value operational details using these criteria:
  - actionable and hard to reconstruct from code at a glance
  - relevant for operation, troubleshooting, maintenance, or safe change execution
  - material impact on reliability, security, compliance, recoverability, or delivery predictability
  - explicitly supported by repository evidence (not inferred)
- When preserving information from a previous README, first map it to existing template sections; use `Preserved operational notes (from previous README)` only for useful residual items that do not fit elsewhere.
- If a required section cannot be fully populated, write `Not found in repository` and list what is missing.
- If no diagram artifact exists, write `Not found in repository` in the architecture diagram section.
- If `docs/solution/solution-landscape.md` does not exist, omit the solution landscape section or mark it `Not found in repository` based on template usage.
- Use relative links for diagram paths and keep naming consistent (for example `architecture-overview`, `delivery-runtime`, `dependency-map`, `execution-flow`, and optional `execution-flow-sync` / `execution-flow-async` under `docs/diagrams/`).
- In `Architecture diagrams`, use a Markdown table with columns: `Diagram`, `Purpose`, `Source (.mmd)`, `Rendered (.svg)`, `Status`.
- In that table, link both source and rendered artifacts with relative links.
- If a diagram is missing, keep the row and write `Not found in repository` in source/rendered cells.
- Keep `Preserved operational notes (from previous README)` before `Conclusions`.
- In `Technical debt status`, always write one explicit state:
  - `No technical debt identified at this time`, or
  - `Technical debt identified` with link to `docs/reviews/security/technical-debt-report.md` and short summary.
- Even if the previous README did not include this section, add
  `Technical debt status` explicitly.
- If debt report is expected but missing, write `Not found in repository`.
- Keep wording concise and operational for engineers.
- If critical context is missing, add a `Context request to user` section with concrete keys and expected values.
```

## Practical usage examples

Generate from scratch:

- repository has no `README.md`
- run this prompt after `prompts/repository-analysis.md`
- save output as the baseline operating document

Update an existing README:

- README exists but differs from current architecture, config, or runtime model
- run this prompt after analysis and overwrite stale sections with evidence-based content

Keep it aligned over time:

- rerun after major refactors, platform changes, dependency shifts, or deployment model changes
- in change-execution workflows, run once before refactoring and once after the first safe change
