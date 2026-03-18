# Workflow 02: Change Request

## Goal

Implement a requested change from free text in a safe, evidence-based way.

## Git stability gate

- default: require clean working tree before starting (`git status --porcelain` must be empty)
- exception: allow dirty state only if request explicitly targets in-progress local changes and user sets `allow_dirty=true`
- if gate fails and no explicit override exists, stop and return `Context request to user`

## Sequence

1. Capture the request text and constraints (scope, deadline, risk tolerance, acceptance criteria).
2. Enforce `Git stability gate` before analysis and implementation.
3. Run `prompts/repository-analysis.md` focused on impacted modules, dependencies, and flows.
4. Run `prompts/architecture-evolution.md` to define a safe implementation approach.
5. Use `templates/technical-debt-report-template.md` to record risks, tradeoffs, and follow-up items.
6. Run `prompts/controlled-refactoring.md` to implement the first safe change slice.
7. If architecture or operations changed, run `workflows/01-documentation-lifecycle.md` with `mode=update`.

## Expected outputs

- scoped change plan tied to repository evidence
- first safe change implemented
- risk/debt items captured for follow-up
- documentation refresh triggered when change impact requires it

## Definition of Done

- Change request scope and constraints are explicit in the conversation.
- First safe change slice is implemented and behavior is preserved.
- Follow-up risk/debt items are captured in the technical debt report.
- `workflows/01-documentation-lifecycle.md` (`mode=update`) is executed (or explicitly deferred with reason) when architecture/runtime/integration changes.

## Documentation usage notes

- This workflow assumes baseline docs already exist from `workflows/01-documentation-lifecycle.md`.
- Keep Git state clean by default so change and resulting documentation are traceable.
- Keep the request and acceptance criteria explicit in the conversation so implementation remains auditable.
- If the change is large, deliver it in small safe slices and rerun this workflow per slice.

## Real usage example

An engineer provides this request: `update currency conversion functions to use a shared helper`.

The objective is to remove duplicated conversion logic without breaking behavior.

Prompt execution in this scenario:

1. Run `prompts/repository-analysis.md` on conversion modules and call sites.
2. Run `prompts/architecture-evolution.md` to define helper placement and migration path.
3. Use `templates/technical-debt-report-template.md` to capture migration risk and remaining call sites.
4. Run `prompts/controlled-refactoring.md` to implement the first safe helper adoption step.
5. Run `workflows/01-documentation-lifecycle.md` with `mode=update` if architecture/module boundaries or flows changed.

Concrete outputs expected:

- first migration slice implemented with behavior preserved
- technical debt entries for pending migrations
- updated docs when structural impact exists

## When not to use this workflow

- when repository context is unknown; run `workflows/01-documentation-lifecycle.md` first
- when there is no explicit change request and you need technical debt reduction planning; use `workflows/03-resolve-technical-debt.md`
