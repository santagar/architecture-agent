# Workflow 04: Review Deliverables

## Goal

Validate that repository documentation and review artifacts are complete, consistent, and aligned with current code.

## Git stability gate

- require clean working tree before governance/release review (`git status --porcelain` must be empty)
- if local changes exist, stop and return `Context request to user`

## Sequence

1. Enforce `Git stability gate`.
2. Define review scope (for example last sprint, release window, or specific change set).
3. Verify expected artifacts exist:
   - `README.md`
   - `docs/meta.json`
   - `docs/diagrams/sources/` (`.mmd`) and `docs/diagrams/rendered/` (`.svg`) diagrams (if architecture is diagrammable)
   - `docs/diagrams/diagram-generation.md` when diagrams exist
   - `docs/solution/diagrams/sources/` (`.mmd`) and `docs/solution/diagrams/rendered/` (`.svg`) diagrams (if multi-repo scope applies)
   - `docs/solution/solution-landscape.md` (if multi-repo scope applies)
   - `docs/reviews/repository/repository-analysis.md`
   - `docs/reviews/repository/repository-scorecard.md`
   - `docs/reviews/architecture/architecture-review.md`
   - `docs/reviews/service/microservice-review.md` when applicable
   - `docs/reviews/iac/iac-review.md` (`direct` or `indirect`)
   - `docs/reviews/security/technical-debt-report.md` when applicable
4. Run Markdown lint baseline:
   - `npx --yes markdownlint-cli2 "README.md" "prompts/**/*.md" "workflows/**/*.md" "templates/**/*.md"`
5. Run `prompts/repository-analysis.md` focused on the review scope.
6. Compare findings against current README and diagrams to detect drift.
7. If drift is found, run `workflows/01-documentation-lifecycle.md` with `mode=update`.
8. If major quality/risk gaps are found, update debt items using `templates/technical-debt-report-template.md`.
9. Record review decision in `docs/reviews/governance/deliverables-review.md` using `templates/deliverables-review-template.md`.
10. Create or update `docs/meta.json` using `templates/docs-meta-template.json` and write a full execution record to `docs/meta/history/<timestamp-or-id>.json`.

## Expected outputs

- explicit pass/fail decision for documentation and review artifacts
- markdown lint result for playbook markdown files
- list of detected gaps (if any)
- updated docs/debt artifacts when drift or risk is confirmed
- execution metadata in `docs/meta.json`

## Definition of Done

- Review decision (`accepted` or `needs-update`) is documented in `docs/reviews/governance/deliverables-review.md`.
- Markdown lint result is recorded in the deliverables review record.
- Missing or stale artifacts are either updated or tracked with owners/actions.
- If drift exists, `workflows/01-documentation-lifecycle.md` (`mode=update`) is executed before closing review.
- `docs/meta.json` is updated as the latest snapshot and points to a full execution record under `docs/meta/history/`.

## Documentation usage notes

- Use this workflow at the end of major changes or before release readiness checks.
- Run it only on a stable Git state to avoid false positives/false negatives in governance decisions.
- Keep scope explicit so review conclusions are auditable.
- This is a review workflow, not a replacement for `01`, `02`, or `03`.

## Real usage example

Before releasing `v2.8.0`, a team runs a documentation readiness review for all merged changes in the current release window.

Prompt execution in this scenario:

1. Verify expected artifacts in `docs/` and `README.md`.
2. Run Markdown lint baseline and record the result.
3. Run `prompts/repository-analysis.md` on modules changed in the release window.
4. Compare analysis with current README and diagrams.
5. Run `workflows/01-documentation-lifecycle.md` with `mode=update` because dependency diagrams are stale.
6. Update debt report for two unresolved operational risks.
7. Mark review as `accepted` after updates.
8. Update `docs/meta.json` with review decision and pending follow-up actions.

Concrete outputs expected:

- release-ready documentation set
- explicit review decision
- tracked follow-up items for unresolved debt/risk

## When not to use this workflow

- when baseline docs do not exist yet; run `workflows/01-documentation-lifecycle.md` first
- when you are in the middle of implementing a change slice; finish with `02` or `03` first
