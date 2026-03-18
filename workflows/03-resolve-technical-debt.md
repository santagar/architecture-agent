# Workflow 03: Resolve Technical Debt

## Goal

Resolve technical debt through safe, incremental execution.

## Git stability gate

- require clean working tree before scoring and debt prioritization (`git status --porcelain` must be empty)
- if the tree is dirty, stop and return `Context request to user`

## Sequence

1. Enforce `Git stability gate`.
2. Run `prompts/repository-analysis.md`
3. Run `prompts/repository-scoring.md` to baseline code quality areas
4. Run `prompts/security-operability.md` to baseline security and operational risks
5. Run `prompts/architecture-evolution.md`
6. Run `prompts/documentation-source-of-truth.md`
7. Use `templates/technical-debt-report-template.md`
8. Run `prompts/controlled-refactoring.md`

## Expected outputs

- technical debt reduction roadmap
- quality baseline and prioritized quality gaps
- security/operability findings with prioritized remediations
- living README
- debt register
- first safe debt-reduction change implemented

## Definition of Done

- Debt-reduction roadmap and priority order are documented.
- Quality and security findings are explicitly reflected in debt prioritization.
- First debt-reduction slice is implemented with behavior preserved.
- Debt register is updated with remaining items and execution sequence.
- `README.md` is refreshed to reflect completed changes.
- `workflows/01-documentation-lifecycle.md` (`mode=update`) is executed when architecture/runtime/integration changed.

## Documentation usage notes

- In step 5, capture the pre-change baseline README before any code refactoring.
- Use that README to align engineers on current architecture and constraints.
- After step 8, rerun `prompts/documentation-source-of-truth.md` to reflect the first implemented change.
- Do not baseline debt on a dirty working tree; this workflow is for stable repository states.
- Keep the README synchronized at each debt-reduction milestone so debt and roadmap decisions stay evidence-based.

## Real usage example

A principal architect is tasked with improving a legacy `order-management` repository with high coupling and low testability.

The goal is to move from analysis to controlled execution, with one safe change delivered first.

Prompt execution in this scenario:

1. Run `prompts/repository-analysis.md` to establish baseline architecture and debt.
2. Run `prompts/repository-scoring.md` to baseline maintainability and testability.
3. Run `prompts/security-operability.md` to baseline security and operational risk.
4. Run `prompts/architecture-evolution.md` to define an incremental target direction.
5. Run `prompts/documentation-source-of-truth.md` to produce current-state documentation before changes.
6. Use `templates/technical-debt-report-template.md` to prioritize remediation.
7. Run `prompts/controlled-refactoring.md` to implement the first low-risk improvement.

Concrete outputs expected:

- staged debt-reduction roadmap aligned with current constraints
- explicit quality and security hardening priorities
- updated README that reflects true repository behavior
- technical debt report with priority and safe sequence
- first debt-reduction change with documented rationale and behavior preservation

## When not to use this workflow

- when repository understanding is still weak; run `workflows/01-documentation-lifecycle.md` first
- when you have a specific free-text change request; use `workflows/02-change-request.md`
- when you only need a point-in-time assessment and no implementation step
