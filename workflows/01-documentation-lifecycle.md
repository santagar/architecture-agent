# Workflow 01: Documentation Lifecycle

## Goal

Create or update repository documentation with the same full assessment process.
The only execution difference is scope:

- `baseline`: analyze the whole repository and build first documentation set
- `update`: analyze a Git window plus current docs and refresh only impacted artifacts

Default behavior for short launch prompts (for example "execute it fully"):

- if docs are missing, run as `mode=baseline`
- if docs already exist, run as `mode=update`
- in `mode=update`, if `Git scope` is omitted, use `origin/main~1..origin/main` (fallback `HEAD~1..HEAD`)
- do not include uncommitted changes unless explicitly requested with `working tree only`
- "execute fully" means run the full sequence for the selected mode, not blind full regeneration when docs already exist

## Git stability gate

- `mode=baseline`: require clean working tree (`git status --porcelain` must be empty)
- `mode=update` with commit scope (`<base>..HEAD`): require clean working tree
- `mode=update` with `working tree only`: allowed on dirty tree, but scope is explicitly local/uncommitted
- if gate fails, stop and return `Context request to user` instead of generating artifacts

## Sequence

1. Start with `Launch recommendations`:
   - suggest missing external context if delivery/runtime/config live in other repositories
   - suggest preserving high-value operational sections from existing `README.md` when present
   - confirm output language if not explicit
   - enforce `Git stability gate` before analysis
2. Set execution mode:
   - `mode=baseline`: first-time repository documentation
   - `mode=update`: ongoing sync after merges/releases
3. Default inference when `mode` is omitted (for example "execute it fully"):
   - if baseline docs are missing (`README.md` absent or `docs/` not initialized), use `mode=baseline`
   - if baseline docs already exist, use `mode=update`
4. Set scope:
   - `baseline`: full repository
   - `update`: required Git scope (`<base>..HEAD` or `working tree only`) plus impacted docs
5. Default inference when `mode=update` and `Git scope` is omitted:
   - default Git scope: `origin/main~1..origin/main` (latest merged change on main)
   - fallback when `origin/main` is unavailable locally: `HEAD~1..HEAD`
   - do not use uncommitted changes unless explicitly requested with `working tree only`
6. Run `prompts/repository-analysis.md` (read `catalog-info.yaml` first when present for organizational metadata).
7. Run `prompts/repository-scoring.md`.
8. Use `templates/repository-scorecard-template.md` to structure scoring output.
9. If it is a service, run `prompts/microservice-review.md`.
10. Run IaC relevance classification using these evidence patterns: Terraform/Terragrunt (`*.tf`, `*.tfvars`, `terragrunt.hcl`), Kubernetes manifests/charts (`k8s/`, `.k8s/`, `helm/`, `charts/`, `Chart.yaml`, `values.yaml`), cloud templates (`cloudformation/`, `*.template`, `pulumi.*`), and policy-as-code (`opa/`, `policies/`, `*.rego`).
11. If checklist matches, classify as `direct`.
12. If checklist does not match but delivery/runtime/config dependency is evidenced via external repos or CI/CD references, classify as `indirect`.
13. If checklist does not match and no indirect evidence is found, still classify as `indirect` and mark evidence as `Not found in repository`.
14. Run `prompts/iac-review.md` using the selected mode (`direct` or `indirect`), and always write `docs/reviews/iac/iac-review.md`.
15. If mode is `indirect` and critical deployment evidence is external/missing, add `Context request to user` and keep `Not found in repository` markers.
16. If architecture is diagrammable (or changed in `mode=update`), run Mermaid renderer pre-check (`mmdc --version` or `npx mmdc --version`).
17. If pre-check passes, run `prompts/diagram-generation.md` and update `docs/diagrams/` (`sources/`, `rendered/`, `diagram-generation.md`).
18. If cross-service boundaries or multi-repo interfaces changed, run `prompts/solution-diagram-generation.md` and refresh `docs/solution/diagrams/` plus `docs/solution/solution-landscape.md`.
19. Run `prompts/documentation-source-of-truth.md` to create or update `README.md`.
20. Ensure README contains `Technical debt status` with one explicit state: `No technical debt identified at this time` or `Technical debt identified` with report reference and short summary.
21. If meaningful risks are found, run `prompts/security-operability.md` and capture remediation using `templates/technical-debt-report-template.md`.
22. Use `templates/architecture-review-template.md` to consolidate the result.
23. Create or update `docs/meta.json` using `templates/docs-meta-template.json` and write a full execution record to `docs/meta/history/<timestamp-or-id>.json`.

## Expected outputs

- repository analysis and scorecard
- architecture diagrams when diagrammable/impacted
- updated or generated README
- IaC review (`direct` or `indirect`)
- optional service/security/solution artifacts when scope requires them
- clear next steps
- execution metadata in `docs/meta.json`

## Definition of Done

- `README.md` is created or updated and grounded on repository evidence.
- `README.md` includes `Technical debt status` with one explicit state.
- `catalog-info.yaml` metadata is consumed when present; missing fields are `Not found in repository`.
- Diagram artifacts in `docs/diagrams/` are updated when architecture is diagrammable (`baseline`) or impacted (`update`).
- If Mermaid renderer is unavailable when diagrams are required, workflow is paused with `Context request to user`.
- Repository score is captured with `templates/repository-scorecard-template.md`.
- IaC review is always documented in `docs/reviews/iac/iac-review.md` with mode `direct` or `indirect`.
- `docs/meta.json` is updated as the latest snapshot and points to a full execution record under `docs/meta/history/`.
- Missing evidence is explicitly marked as `Not found in repository`.

## Documentation usage notes

- This is the single documentation workflow for both first creation and later updates.
- In `mode=update`, do not regenerate everything blindly; refresh only impacted artifacts after full scope-aware analysis.
- If `mode` is omitted, infer it from existing docs state (`baseline` or `update`) before execution.
- If `mode=update` and `Git scope` is omitted, default to `origin/main~1..origin/main` and avoid `working tree` unless explicitly requested.
- If docs already exist and prompt says only "execute fully", treat it as `mode=update` with default Git scope.
- Do not execute with dirty Git state unless scope is explicitly `working tree only`.
- If `README.md` exists, preserve high-value operational sections only when evidence still supports them.
- Lock scoring profile explicitly (`service`, `library`, or `iac`) for consistent assessment scope.
- Ensure `IaC and deployment governance` is always scored using mode `direct` or `indirect`.
- Use `mode=update` after merges/releases and after implementing `03` or `04`.

## Artifact path convention

- `docs/meta.json`
- `docs/diagrams/diagram-generation.md`
- `docs/reviews/repository/repository-analysis.md`
- `docs/reviews/repository/repository-scorecard.md`
- `docs/reviews/service/microservice-review.md` (if applicable)
- `docs/reviews/iac/iac-review.md` (always; mode `direct` or `indirect`)
- `docs/reviews/security/technical-debt-report.md` (if meaningful risks are found)
- `docs/reviews/architecture/architecture-review.md`

## Real usage example

A team already has baseline docs and needs post-merge synchronization for `v2.9.0..HEAD`.

Goal: run the same full process without recreating everything from scratch.

Prompt execution in this scenario:

1. Run `workflows/01-documentation-lifecycle.md` with `mode=update`.
2. Set Git scope `v2.9.0..HEAD`.
3. Run full sequence (analysis, scoring, IaC, README, consolidation).
4. Refresh only impacted diagrams/reviews based on scope evidence.
5. Update `docs/meta.json` with mode/scope/artifacts.

Concrete outputs expected:

- README synchronized with current implementation and explicit technical debt status
- diagrams/reviews updated only where changes impacted architecture/runtime/integrations
- reproducible scorecard and architecture review for the current change window

## When not to use this workflow

- when you only need one focused artifact (for example only IaC review)
- when you are implementing code changes (use `03` or `04` first, then rerun this workflow in `mode=update`)
