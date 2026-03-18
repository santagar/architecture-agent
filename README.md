# AI Architecture Agent

[![CI](https://github.com/santagar/architecture-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/santagar/architecture-agent/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@santagar/architecture-agent)](https://www.npmjs.com/package/@santagar/architecture-agent)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

This repository is an operating playbook for AI-assisted architecture work, designed for **Principal Architects**, **Software Architects**, and **Platform Engineers**, and usable with any AI assistant or development environment.

It is intended to help with:

- understanding unknown repositories quickly
- performing architecture and platform reviews
- auditing microservices and Infrastructure as Code
- generating living documentation
- producing repeatable technical assessments
- driving safe, incremental repository evolution

Community and governance:

- contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- support channels: [SUPPORT.md](./SUPPORT.md)
- security policy: [SECURITY.md](./SECURITY.md)
- roadmap: [ROADMAP.md](./ROADMAP.md)
- release history: [CHANGELOG.md](./CHANGELOG.md)

## Start with the package (consumer-first)

If you are in a service repository and want immediate usage from IDE:

1. Install dependency in the target repository:

```bash
npm i -D @santagar/architecture-agent
```

1. Ensure runtime prerequisites:

- Node.js 18+
- npm

1. Discover launch options quickly:

```bash
npx architecture-agent help launch
```

1. Generate a launch instruction from terminal:

```bash
npx architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main
# or launch a single prompt directly
npx architecture-agent launch prompt repository-analysis
# optionally copy launch output to clipboard
npx architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main --copy
```

1. Paste that output into your AI assistant chat and execute.
The generated block already includes package retrieval commands (`npx architecture-agent show ...`) so the assistant can fetch the selected workflow/prompt source.
If you launch with `--copy` (or set `copyOnLaunch=true` in local config), the text is copied automatically to clipboard.
Clipboard commands used by platform: `pbcopy` (macOS), `clip` (Windows), `wl-copy`/`xclip`/`xsel` (Linux).

1. Optional: initialize local defaults in the target repo:

```bash
npx architecture-agent init
```

Detailed package usage, scripts, VS Code task binding, and publishing automation are documented in [Use as npm package](#use-as-npm-package).

## TL;DR

Run the playbook in this order:

1. `01-documentation-lifecycle`
2. `02-change-request` or `03-resolve-technical-debt`
3. `01-documentation-lifecycle` (`mode=update` after merges/implemented changes)
4. `04-review-deliverables` (recommended before release/governance checkpoints)
5. `05-solution-landscape` (when you need a multi-repo or system view)

## Agent essence

### Purpose of each area

### `prompts/`

The core prompt library.

Each file contains a reusable prompt for a specific type of analysis or action.  
These are the building blocks you use directly inside Codex, ChatGPT, or another AI assistant connected to a repository.

Use this folder when you want a **single focused interaction**, for example:

- analyze a repository
- review Terraform
- generate a README
- score technical quality
- review security and operability

### `workflows/`

Operational sequences.

Each file explains **how to chain multiple prompts** together for a real engineering scenario.  
This is where the playbook becomes practical and repeatable.

Use this folder when you want to perform an end-to-end activity such as:

- opening an unknown repository
- building a multi-repository solution landscape
- implementing a specific requested change
- reducing technical debt with controlled execution
- keeping README and documentation aligned with merged Git changes using `01` in `mode=update`
- producing targeted review/debt artifacts only when change scope requires them
- validating deliverables completeness before release or governance review

### `templates/`

Output structures and expected deliverables.

These templates define how AI or humans should shape the resulting artifacts so that the output is consistent across repositories and teams.

Use this folder when you want standard outputs like:

- architecture reviews
- README files
- technical debt reports
- scorecards
- deliverables review decisions
- documentation run metadata (`docs/meta.json` via `templates/docs-meta-template.json`)
- local CLI defaults (`.architecture-agent.json` via `templates/agent-config-template.json`)
- catalog and service metadata templates (`catalog-info.yaml` + optional extension metadata)

## Recommended ways to use this playbook

### 1. Standalone usage

Pick one prompt from `prompts/` and run it directly in your IDE conversation.

Good when you need:

- a quick audit
- a focused review
- a one-off README generation

### 2. Chained workflow usage

Start from a file in `workflows/` and follow the sequence.

Good when you need:

- a full architecture assessment
- a multi-repository solution view (business capabilities and cross-service flows)
- a request-driven change implementation
- a technical debt, quality, and security hardening roadmap with safe execution
- a documentation maintenance cycle after merged changes
- a final documentation/review quality gate

### 3. Prompt + template usage (single deliverable)

Use this when you need one concrete artifact, but you do not need a full workflow.

How it works:

1. Run one focused prompt from `prompts/`.
2. Shape the output with one template from `templates/`.
3. Save it directly as the final artifact in the target repository.

Good when you need:

- a formal architecture review in a fixed format
- a scorecard with comparable structure across repositories
- a technical debt report ready to share

Quick example:

- run `prompts/repository-scoring.md`
- structure result with `templates/repository-scorecard-template.md`
- choose scoring profile: `service`, `library`, or `iac`
- write `docs/reviews/repository/repository-scorecard.md`

## How to Run in IDE

Use this procedure in Visual Studio Code with the target repository open.

### 1. Open the target repository

1. Open the target repository: `File -> Open Folder...`
2. Reference the playbook by name in the launch prompt

Operational rule:

- Run workflows against the target repository.
- Use the playbook name as source of prompts/workflows/templates.

### 2. Pick the workflow by intent

- `workflows/01-documentation-lifecycle.md`: documentation lifecycle (`mode=baseline` for first run, `mode=update` for merges/releases).
- `workflows/02-change-request.md`: implement a specific free-text request.
- `workflows/03-resolve-technical-debt.md`: reduce technical debt and prioritize quality/security hardening.
- `workflows/04-review-deliverables.md`: validate that docs/reviews are complete and aligned.
- `workflows/05-solution-landscape.md`: build a multi-repository business and architecture view.

### 3. Launch with an explicit instruction

If the current session is already in the target repository, include:

- `Agent: architecture-agent (in parent directories of the current repository)`

#### Minimal examples

Use these when you want the shortest valid launch.

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/01-documentation-lifecycle.md` and execute it fully in the current repository.
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/01-documentation-lifecycle.md` with `mode=update` to refresh documentation from recent repository changes.
Git scope: origin/main~1..origin/main (default: last change on main).
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/02-change-request.md`.
Change request: "<your free-text request>".
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/03-resolve-technical-debt.md` and execute the next safe debt-reduction slice including quality/security baseline.
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/04-review-deliverables.md` to validate documentation and review artifacts before release.
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/05-solution-landscape.md` to generate a multi-repository solution view.
System scope: "<system-or-domain-name>".
Related repositories: <repo-a>, <repo-b>.
```

#### Implicit defaults for the shortest launch

If you launch only:

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/01-documentation-lifecycle.md` and execute it fully in the current repository.
```

the workflow should infer:

- no baseline docs yet: `mode=baseline`
- baseline docs already exist: `mode=update`
- if inferred mode is `update` and no `Git scope` is provided: `origin/main~1..origin/main` (fallback `HEAD~1..HEAD`)
- uncommitted files are excluded by default (use `working tree only` only when you explicitly want local changes)
- `execute fully` means full workflow sequence for the selected mode, not blind full regeneration when docs already exist
- if a workflow requires stable Git state and the tree is dirty, stop with `Context request to user`

#### Recommended examples

Use these when you want predictable output structure and fewer ambiguities.

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/01-documentation-lifecycle.md` and execute it fully in the current repository.
Pre-check Mermaid renderer: `mmdc --version` (or `npx mmdc --version`) before diagram generation.
Update real files, not draft text.
Score includes `IaC and deployment governance` as a weighted area using mode `direct` or `indirect`.
For IaC consistency, always write `docs/reviews/iac/iac-review.md` (mode `direct` or `indirect`).
Write artifacts to:
- README.md
- docs/meta.json
- docs/diagrams/sources/
- docs/diagrams/rendered/
- docs/diagrams/diagram-generation.md
- docs/reviews/repository/repository-scorecard.md
- docs/reviews/repository/repository-analysis.md
- docs/reviews/architecture/architecture-review.md
- docs/reviews/service/microservice-review.md (if applicable)
- docs/reviews/iac/iac-review.md (mode `direct` or `indirect`)
Use organizational metadata from `catalog-info.yaml` when present (optional extension: `docs/metadata/service-metadata.yaml`).
If evidence is missing, write "Not found in repository".
Output language: English. (optional)
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/01-documentation-lifecycle.md` with `mode=update`.
Git scope: origin/main~1..origin/main (default: last change on main; or `working tree only`).
Refresh README and diagrams (`sources/*.mmd` + `rendered/*.svg`) when affected.
Always refresh `docs/reviews/iac/iac-review.md` with mode `direct` or `indirect`.
If `catalog-info.yaml` changed in the Git scope, refresh organizational metadata sections too.
Update `docs/meta.json` with workflow status and changed artifacts.
Output language: English. (optional)
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/02-change-request.md`.
Change request: "<your free-text request>".
Constraints: preserve behavior, minimal safe slice first.
After implementation, run `workflows/01-documentation-lifecycle.md` with `mode=update` if architecture, delivery/runtime, dependencies, or execution flow changed.
Output language: English. (optional)
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/03-resolve-technical-debt.md` to execute the next debt-reduction slice.
Include `prompts/repository-scoring.md` and `prompts/security-operability.md` in the execution.
Base prioritization on `templates/technical-debt-report-template.md`.
After implementation, run `workflows/01-documentation-lifecycle.md` with `mode=update`.
Output language: English. (optional)
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/04-review-deliverables.md`.
Scope: release candidate review.
Run Markdown lint baseline: `npx --yes markdownlint-cli2 "README.md" "prompts/**/*.md" "workflows/**/*.md" "templates/**/*.md"`.
Return decision as: accepted or needs-update.
Use `templates/deliverables-review-template.md` for the decision record.
If needs-update, execute `workflows/01-documentation-lifecycle.md` with `mode=update` and re-check.
Output language: English. (optional)
```

```text
Agent: architecture-agent (in parent directories of the current repository)
Use `workflows/05-solution-landscape.md`.
System scope: "<system-or-domain-name>".
Related repositories:
- <repo-a-path-or-url> (role=<role-a>)
- <repo-b-path-or-url> (role=<role-b>)
Cross-repo interfaces: <contract-1>, <contract-2>.
Metadata files per repo: `catalog-info.yaml` (preferred) and optional `docs/metadata/service-metadata.yaml` (extension for extra fields).
Write artifacts to:
- docs/meta.json
- docs/solution/diagrams/sources/
- docs/solution/diagrams/rendered/
- docs/solution/solution-landscape.md
If evidence is missing, write "Not found in repository".
Output language: English. (optional)
```

### 3.1 Default documentation preservation (built-in)

When a repository already has `README.md`, `workflows/01-documentation-lifecycle.md` in `mode=update` includes preservation behavior for high-value operational content, when evidence still supports it.

You do not need to add extra launch lines for this (for example preserving thresholds, headers, PromQL snippets, tracing conventions, env vars, or CI secret contracts).

### 3.2 Git scope explained

`Git scope` defines which code changes are used to drive updates in
`mode=update`.

Recommended default:

- `origin/main~1..origin/main`: only the latest commit on main

Other valid options:

- `<base>..HEAD`: from a specific base commit/tag/branch to current HEAD
- `working tree only`: only uncommitted local changes

Examples:

- `v2.7.0..HEAD` (release window)
- `origin/main..HEAD` (branch delta against main)
- `working tree only` (no commit range)

Operational rule:

- Keep scope as small as possible for accurate updates and less noise.
- If remote refs are stale, run `git fetch` before using
  `origin/main~1..origin/main`.

### 3.3 Git stability gate (default policy)

To avoid low-quality or non-reproducible outputs, workflows apply a Git state gate.

Default policy:

- `01-documentation-lifecycle`:
  - `mode=baseline` or commit scope update (`<base>..HEAD`): clean tree required
  - `mode=update` + `working tree only`: dirty tree allowed (explicit local scope)
- `02-change-request`: clean tree required by default; allow dirty only with explicit `allow_dirty=true`
- `03-resolve-technical-debt`: clean tree required
- `04-review-deliverables`: clean tree required
- `05-solution-landscape`: prefer clean/pinned refs; dirty context only with explicit `allow_dirty_context=true`

When gate fails and no explicit override exists, workflow should stop and return `Context request to user`.

### 3.4 Diagram renderer pre-check

Use this before any workflow step that must generate diagram SVG files.

Check:

```bash
mmdc --version
# or
npx mmdc --version
```

If command is missing, install Mermaid CLI in the target repository and rerun:

```bash
npm i -D @mermaid-js/mermaid-cli
npx mmdc --version
```

Operational rule:

- Do not close documentation workflows as complete when architecture is diagrammable but SVG rendering is blocked by missing renderer.
- If renderer cannot be installed in the current environment, return `Context request to user` and keep this as an open blocker.

### 3.5 Markdown lint baseline (minimal)

Use this as the default quality check for playbook Markdown files.

Config file (already in this repository):

- `.markdownlint-cli2.jsonc`

Command:

```bash
npx --yes markdownlint-cli2 "README.md" "prompts/**/*.md" "workflows/**/*.md" "templates/**/*.md"
```

Operational rule:

- Run this in `workflows/04-review-deliverables.md`.
- If it fails, either fix issues in scope or record an explicit waiver in the deliverables review decision.

### 3.6 External context (deployment or multi-repo systems)

Use this when key evidence is outside the target repository.
For cross-service solution mapping, prefer `workflows/05-solution-landscape.md`.

Deployment manifests outside the app repository:

```text
External deployment evidence:
- Deployment repository: <path-or-url>
- Service identifier: <service-name>
- Path to inspect: <path-1>
- Path to inspect: <path-2>
- Authoritative source for delivery/runtime: deployment repository paths above
- If evidence is missing or inaccessible, write "Not found in repository" and add open questions.
```

Multi-repository or multi-service solution context:

```text
External system context:
- System scope: <system-or-domain-name>
- Related repository: <repo-a-path-or-url> | role: <role>
- Related repository: <repo-b-path-or-url> | role: <role>
- Metadata per repository: `catalog-info.yaml` (or optional `docs/metadata/service-metadata.yaml`)
- Cross-repo interface to validate: <api-or-event-contract-1>
- Cross-repo interface to validate: <api-or-event-contract-2>
- Source-of-truth precedence: app behavior = target repository
- Source-of-truth precedence: delivery/runtime = deployment repository
- Source-of-truth precedence: shared contracts = contract repository (if present)
- If repositories cannot be accessed, write "Not found in repository" and list assumptions as open questions.
```

Recommended usage:

- Keep the target repository as the default source of truth unless you explicitly override it.
- Declare source-of-truth precedence in the launch message to avoid conflicting conclusions.
- For `workflows/01-documentation-lifecycle.md` in `mode=update`, provide Git scope for each repository in scope (default `origin/main~1..origin/main`).
- Keep external scope minimal (only repositories and paths relevant to the service or change window).
- Never infer delivery/runtime details when manifests are inaccessible; record `Not found in repository`.

Short prompt variants (copy/paste):

External deployment (short):

```text
External deployment evidence: deployment repo=<path-or-url>; service=<service-name>; paths=<path-1>,<path-2>; source-of-truth delivery/runtime=deployment repo; if missing=infer nothing + write "Not found in repository".
```

Multi-repo/multi-service (short):

```text
External system context: scope=<system>; repos=<repo-a:role>,<repo-b:role>; interfaces=<contract-1>,<contract-2>; source-of-truth app=target repo; delivery/runtime=deployment repo; contracts=contract repo; if inaccessible=write "Not found in repository" + open questions.
```

### 3.6 Assisted missing-context mode

Prompts in this playbook are configured to request missing context in a guided way.

When the model cannot validate critical evidence, it should return a `Context request to user` section with:

- why execution is blocked
- which exact fields are missing
- a copy/paste reply template for chat

Expected model output pattern:

```text
Context request to user:
- Blocker: <short reason>
- Required input: <field-1>
- Required input: <field-2>
- Reply with:
  - <field-1>: <value>
  - <field-2>: <value>
```

Recommended reply pattern:

```text
Context provided:
- <field-1>: <value>
- <field-2>: <value>
Continue from the current workflow step.
```

Launch hint (optional but useful):

```text
If execution is blocked by missing context, pause and return `Context request to user` with exact keys to answer in chat.
```

## Use as npm package

You can distribute this repository as a private npm package and consume it from any project/repository, independently of implementation language.

### Package commands

After install, the CLI exposes:

- `architecture-agent help [launch|start]`
- `architecture-agent list [workflows|prompts|templates|all]`
- `architecture-agent show <workflows|prompts|templates> <name>`
- `architecture-agent launch <workflow|prompt> <selector> [--copy|--no-copy]`
- `architecture-agent init` (creates `.architecture-agent.json` in the current repository)

Prerequisites for package usage in any repository type (Java, Python, Rust, Terraform, etc.):

- Node.js 18+ available in developer machine/CI runner
- npm available to install and run the CLI

Packaging note:

- npm artifact ships compiled/minified CLI from `dist/` to reduce source readability
- raw `prompts/`, `workflows/`, and `templates/` folders are embedded into the bundled CLI and are not published as plain files
- `lib/` and `bin/` are development sources and are not included in published tarballs

Examples:

```bash
architecture-agent help launch
architecture-agent help start
architecture-agent list workflows
architecture-agent show workflows 01
architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main
architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main --copy
architecture-agent launch prompt repository-analysis
architecture-agent launch workflow 02 --change-request "Extract currency helper"
```

Expected launch output pattern:

```text
Agent: architecture-agent (installed npm package @santagar/architecture-agent)
Retrieve workflow instructions from package:
- `npx architecture-agent show workflows 01`
Then execute workflow `01-documentation-lifecycle.md` ... in the current repository.
```

### Publish to npmjs (public package)

The package is configured for public npm publishing.

Typical release flow:

```bash
npm version patch
npm publish
```

### Release checklist (quick)

Use this checklist before and after publishing a new package version.

Before publish:

1. Ensure local branch is up to date and clean.
2. Run quality checks:
   - `npm run build`
   - `npm run lint:md`
3. Bump version:
   - `npm version patch` (or `minor` / `major`)
4. Push commit and tag:
   - `git push --follow-tags`

After publish:

1. Verify package metadata:
   - `npm view @santagar/architecture-agent version`
2. Smoke test CLI via npx:
   - `npx @santagar/architecture-agent@latest list workflows`
   - `npx @santagar/architecture-agent@latest launch workflow 01`
   - `npx @santagar/architecture-agent@latest show prompts repository-analysis`
3. Validate launch output includes package retrieval command (`npx architecture-agent show ...`).

### Auto publish to npmjs from `main` (GitHub Actions)

This repository includes:

- `.github/workflows/publish-npm.yml`

Behavior:

- triggers on push to `main`
- installs dependencies and builds `dist/` before publish
- checks package version from `package.json`
- skips publish if `<name>@<version>` already exists in npm
- publishes only new versions to npmjs
- supports manual trigger (`workflow_dispatch`) with:
  - `publish_mode=release`: publish `package.json` version with tag `latest`
  - `publish_mode=canary`: auto-generate prerelease version and publish with tag `canary`

Required repository secret:

- `NPM_TOKEN`: npm access token with publish rights

Operational note:

- each publish requires a new version in `package.json` (for example `npm version patch`)
- npm versions are immutable: you cannot republish the same `<name>@<version>` even with force

### Consume in a service repository (dependency model)

Use this in the target service repository where you want to run the agent workflows.

1. Install dependency:

```bash
npm i -D @santagar/architecture-agent
```

1. Initialize local defaults:

```bash
npx architecture-agent init
```

This creates `.architecture-agent.json` in the service repository.

Clipboard copy is enabled by default in that file. To disable:

```json
{
  "copyOnLaunch": false
}
```

1. Add scripts to `package.json` of the service:

```json
{
  "scripts": {
    "agent:list": "architecture-agent list workflows",
    "agent:show:01": "architecture-agent show workflows 01",
    "agent:launch:prompt:analysis": "architecture-agent launch prompt repository-analysis --copy",
    "agent:launch:01:baseline": "architecture-agent launch workflow 01 --mode baseline --copy",
    "agent:launch:01:update": "architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main --copy",
    "agent:launch:02": "architecture-agent launch workflow 02 --change-request \"<your free-text request>\"",
    "agent:launch:03": "architecture-agent launch workflow 03",
    "agent:launch:04": "architecture-agent launch workflow 04",
    "agent:launch:05": "architecture-agent launch workflow 05 --system-scope \"<system-or-domain-name>\" --related-repo \"<repo-a>\" --related-repo \"<repo-b>\""
  }
}
```

1. IDE invocation flow (VS Code):

- open the service repository in VS Code
- open integrated terminal
- run one launch script (for example `npm run agent:launch:01:update`)
- copy the generated text output
- paste it into your Codex/ChatGPT IDE chat
- execute and let the model run the referenced workflow in the current repository

1. Optional VS Code task binding:

Create `.vscode/tasks.json` in the service repo:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Agent Launch 01 Update",
      "type": "shell",
      "command": "npm run agent:launch:01:update",
      "problemMatcher": []
    }
  ]
}
```

Then run from Command Palette: `Tasks: Run Task` -> `Agent Launch 01 Update`.

### Local defaults template

Base template for `.architecture-agent.json`:

- `templates/agent-config-template.json`

### Optional: publish/consume via GitHub Packages (private)

If you prefer private distribution, you can use GitHub Packages:

```ini
@santagar:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Publish:

```bash
npm publish --registry=https://npm.pkg.github.com
```

Install:

```bash
npm i -D @santagar/architecture-agent
```

### 4. Use consistent artifact locations

Recommended target-repo locations:

These are output locations in the target repository.

- `README.md`
- `docs/meta.json`
- `catalog-info.yaml` (recommended metadata source)
- `docs/metadata/service-metadata.yaml` (optional metadata extension)
- `docs/diagrams/sources/*.mmd`
- `docs/diagrams/rendered/*.svg`
- `docs/diagrams/diagram-generation.md`
- `docs/solution/diagrams/sources/*.mmd` (when using workflow 05)
- `docs/solution/diagrams/rendered/*.svg` (when using workflow 05)
- `docs/solution/solution-landscape.md` (when using workflow 05)
- `docs/reviews/repository/repository-analysis.md`
- `docs/reviews/repository/repository-scorecard.md`
- `docs/reviews/architecture/architecture-review.md`
- `docs/reviews/service/microservice-review.md` (if applicable)
- `docs/reviews/iac/iac-review.md` (mode `direct` or `indirect`)
- `docs/reviews/security/technical-debt-report.md`
- `docs/reviews/governance/deliverables-review.md` (when using workflow 04)

### 4.1 Example outputs (inline)

Use these as calibration references for expected output style and depth.

Example for `01-documentation-lifecycle` (scorecard excerpt):

```text
| Area | Weight (%) | Score | Confidence | Notes |
|---|---:|---:|---|---|
| Architecture quality | 15 | 7 | high | Clear module split, but some cross-module coupling remains. |
| Testing strategy and coverage | 12 | 5 | medium | Limited integration coverage in critical flows. |
| Security baseline | 12 | 6 | medium | Basic controls exist, but hardening gaps remain. |
```

Example for `01-documentation-lifecycle` (`mode=update`, summary excerpt):

```text
Change window: v2.7.0..HEAD
Updated artifacts:
- README.md
- docs/meta.json
- docs/diagrams/diagram-generation.md
- docs/diagrams/sources/architecture-overview.mmd
- docs/diagrams/rendered/architecture-overview.svg
- docs/diagrams/sources/dependency-map.mmd
- docs/diagrams/rendered/dependency-map.svg
```

Example for `02-change-request` (change output excerpt):

```text
Request: "Update currency conversion methods to use a shared helper."
First safe slice implemented:
- added shared currency helper
- migrated first call path
- behavior preserved with regression test
```

Example for `03-resolve-technical-debt` (debt report excerpt):

```text
High priority:
- duplicated order-state transitions
- impact: inconsistent behavior and defect risk
- remediation: extract shared transition service
```

Example for `04-review-deliverables` (review decision excerpt):

```text
Decision: accepted
Markdown lint: passed
Follow-up actions:
1. add rollback notes to operations section
2. close two medium debt items next sprint
```

Example for `05-solution-landscape` (solution output excerpt):

```text
System scope: checkout domain
Generated artifacts:
- docs/meta.json
- docs/solution/diagrams/sources/solution-context.mmd
- docs/solution/diagrams/rendered/solution-context.svg
- docs/solution/diagrams/sources/business-flow.mmd
- docs/solution/diagrams/rendered/business-flow.svg
- docs/solution/solution-landscape.md
```

### 5. Language policy (no ambiguity)

- Always set language explicitly in the launch message: `Output language: <language>`.
- If repository docs already exist, keep the same language.
- If no docs exist, default to English unless your team standard says otherwise.
- Keep one primary language per repository documentation set to avoid mixed-language artifacts.

### 6. Natural execution order

1. `01-documentation-lifecycle`
2. `02-change-request` or `03-resolve-technical-debt`
3. `01-documentation-lifecycle` (`mode=update` after implemented changes)
4. `04-review-deliverables` (recommended before release/governance checkpoints)
5. `05-solution-landscape` (when one repository is not enough)

Rule: after any implemented change, run `01-documentation-lifecycle` in `mode=update` when architecture, delivery/runtime, dependencies, execution flow, or IaC changed.

## Metadata Convention

Use metadata files in target repositories to avoid guessing organizational hierarchy.

Recommended files and precedence:

1. `catalog-info.yaml` (primary source; Backstage-aligned)
2. `docs/metadata/service-metadata.yaml` (optional extension for fields not covered by catalog)
3. `CODEOWNERS` (ownership fallback only)

Recommended templates:

- `templates/catalog-info-template.yaml`
- `templates/service-metadata-template.yaml`

Operational rule:

- Workflows `01` and `05` should read `catalog-info.yaml` first for `service`, `system/solution`, `domain`, `owner/team`, and `lifecycle`.
- Use `service-metadata.yaml` only to enrich missing fields (for example `area`, `subdomain`, `criticality`, `tier`).
- If the same field conflicts between both files, `catalog-info.yaml` wins.
- If metadata is missing, keep `Not found in repository` instead of inferring.

Launch snippet (optional):

```text
Organizational metadata source:
- catalog-info.yaml (authoritative)
- docs/metadata/service-metadata.yaml (optional extension)
- CODEOWNERS (ownership fallback)
If missing, write "Not found in repository".
```

## Playbook Version Alignment

Use this policy to avoid desynchronization between repositories using different playbook releases.

1. Version the playbook by release (tag or release id).
2. Record `Playbook version` in generated artifacts (scorecard, architecture review, debt report, deliverables review).
3. When workflows/prompts/templates change, rerun `workflows/04-review-deliverables.md` on active repositories.
4. If a repository has artifacts generated with an older playbook version:
   - run `workflows/01-documentation-lifecycle.md` with `mode=update`
   - run `workflows/04-review-deliverables.md`
   - update artifact metadata to the current playbook version
5. Avoid mixing artifacts produced by different playbook versions in the same review cycle.

## Documentation operating model

Use `prompts/documentation-source-of-truth.md` as the standard way to keep repository documentation live and evidence-based.

- Generate from scratch when no README exists.
- Update in place when README exists but is stale.
- Run after `prompts/repository-analysis.md`, not before.
- Generate or refresh diagrams with `prompts/diagram-generation.md` whenever architecture, delivery/runtime, dependencies, or execution-flow scope changes.
- Structure output with `templates/readme-template.md`.
- Treat the README as a human source of truth for onboarding and architecture review.
- In README, always include `Technical debt status` as one explicit state:
  - `No technical debt identified at this time`, or
  - `Technical debt identified` with link/reference to `docs/reviews/security/technical-debt-report.md` plus short summary.
- Refresh it after architectural changes, change-execution milestones, or major operational changes.
- Update `docs/meta.json` at the end of each documentation workflow (`01`, `05`).
- For post-merge updates, use `workflows/01-documentation-lifecycle.md` with `mode=update`.
- Before release/governance checkpoints, run `workflows/04-review-deliverables.md`.

### Documentation update policy

Run `workflows/01-documentation-lifecycle.md` in `mode=update` whenever a merge or release includes changes to:

- architecture or module boundaries
- delivery/runtime behavior
- interfaces, dependencies, or execution flows (request, event, or scheduled/cron)
- infrastructure/IaC, security-relevant config, or operational behavior

Expected policy outcome:

- README reflects current behavior
- diagrams stay synchronized with architecture, delivery/runtime, dependency, and execution-flow changes
- debt/review artifacts are refreshed only when change scope requires them

### Review artifact boundaries

Use these two artifacts for different decisions:

- `docs/reviews/architecture/architecture-review.md`: repository-level architecture posture (module boundaries, platform alignment, top risks, technical debt, next steps).
- `docs/reviews/service/microservice-review.md`: service-level behavior in a distributed landscape (service boundaries, API/data contracts, coupling, resilience, scalability).

Rule of thumb:

- Run `architecture-review` when you need the broad repository/system view.
- Run `microservice-review` when the repository is a service and you need contract/coupling/resilience depth.
- Use both when a service also needs governance-level architecture assessment.

### Review artifact taxonomy

Use `docs/reviews/` groups by analysis lens, not by where code lives.

| Subgroup | Primary question | Typical artifacts | When to generate |
| --- | --- | --- | --- |
| `repository` | What is the overall health and baseline of this repository? | `repository-analysis.md`, `repository-scorecard.md` | Always in baseline workflows (`01`), and in updates when broad impact exists. |
| `architecture` | Are architecture boundaries and technical direction coherent? | `architecture-review.md` | When architecture posture or governance-level assessment is needed. |
| `service` | Is this service behavior sound in a distributed system context? | `microservice-review.md` | When the repo is a service and contract/coupling/resilience depth is needed. |
| `iac` | Is infrastructure-as-code secure and operable? | `iac-review.md` | When Terraform/Kubernetes/IaC is present or changed. |
| `security` | Which risks require remediation tracking? | `technical-debt-report.md` | When meaningful security/operability risks are identified. |
| `governance` | Are deliverables complete and release-ready? | `deliverables-review.md` | At release/readiness checkpoints (`04`). |

Decision rule:

- Start with `repository` for the global baseline.
- Add specialized subgroups (`architecture`, `service`, `iac`, `security`, `governance`) only when scope requires deeper analysis.

### Diagram path convention

For README architecture references, prefer this hierarchy and stable names:

- index: `docs/diagrams/diagram-generation.md`
- source: `docs/diagrams/sources/architecture-overview.mmd`
- rendered: `docs/diagrams/rendered/architecture-overview.svg`
- source: `docs/diagrams/sources/delivery-runtime.mmd` (when needed; include CI/CD pipeline stages and group nodes by tool/platform using `subgraph` blocks: `CI/CD pipeline (<tool>)`, optional `Artifact registry`, and `Runtime platform (<target>)`)
- rendered: `docs/diagrams/rendered/delivery-runtime.svg` (when needed)
- source: `docs/diagrams/sources/dependency-map.mmd` (when needed)
- rendered: `docs/diagrams/rendered/dependency-map.svg` (when needed)
- source: `docs/diagrams/sources/execution-flow.mmd` (when needed, including cron/event-driven services)
- rendered: `docs/diagrams/rendered/execution-flow.svg` (when needed)
- source: `docs/diagrams/sources/execution-flow-sync.mmd` (optional when sync and async both matter)
- rendered: `docs/diagrams/rendered/execution-flow-sync.svg` (optional)
- source: `docs/diagrams/sources/execution-flow-async.mmd` (optional when sync and async both matter)
- rendered: `docs/diagrams/rendered/execution-flow-async.svg` (optional)

Diagram style policy:

- `architecture-overview`: `flowchart LR` with `subgraph` groups for service internals, data stores, and external systems.
- `dependency-map`: `flowchart LR` with `subgraph` groups by dependency boundary (in-repo modules, internal platform services, external providers).
- `delivery-runtime`: `flowchart LR` with `subgraph` groups for `CI/CD pipeline (<tool>)`, optional `Artifact registry`, and `Runtime platform (<target>)`.
- `execution-flow`: `sequenceDiagram` for sync request/response (prefer Mermaid `box` domain grouping), `flowchart LR` for async/cron/event (prefer `subgraph` grouping by trigger/processing/side effects).
- `execution-flow` scope: cover prioritized flow sets (sync, async, scheduled) and keep 3-5 high-value flows; list non-prioritized flows in `docs/diagrams/diagram-generation.md` as out-of-scope.

Use relative links from `README.md` to keep rendering consistent across IDE and Git hosting UIs.
If SVG rendering is not available in the current environment, keep `.mmd` sources and explicitly record the rendering limitation.

## How to keep growing this repository

Treat this playbook as a **living architecture asset**, not as a static prompt dump.

### Add new prompts when

- you repeat the same kind of analysis more than twice
- a review pattern becomes useful across teams
- a specific technology needs its own audit prompt
- a missing concern appears repeatedly, such as Kubernetes, data platforms, event-driven systems, IAM, FinOps, or observability

### Add new workflows when

- you notice a recurring sequence of prompts
- you want a standard process for architects
- you need repeatable reviews across many repositories or business units

### Add new templates when

- different people produce inconsistent outputs
- architecture reviews need a common shape
- you want comparable results across repositories
- you need standard artifacts for governance or reporting

### Good evolution rules

- keep prompts concrete and evidence-based
- separate diagnosis prompts from execution prompts
- prefer small reusable prompts over giant monoliths unless the workflow really needs it
- record what each file is for in its header
- version changes through pull requests
- periodically clean duplicated prompts
- add examples when a prompt is subtle or easy to misuse

## Suggested future growth areas

You may want to add dedicated sections later for:

- Kubernetes and runtime platform audits
- AWS account and landing zone reviews
- data platform assessments
- event-driven architecture reviews
- API governance
- IAM and secrets management
- reliability and SRE reviews
- FinOps and cost posture
- SDLC and delivery governance
- AI/LLM system architecture reviews

## Naming guidance

Keep filenames explicit and boring. Prefer names like:

- `kubernetes-platform-review.md`
- `event-driven-architecture-audit.md`
- `aws-account-baseline-review.md`

Avoid vague names like:

- `advanced-prompt.md`
- `smart-review.md`

## Final principle

This repository should help you turn AI into:

- an architecture reviewer
- a platform assessment assistant
- a documentation generator
- a change-execution copilot
- a governance accelerator

The value is not in the prompts alone.  
The value is in making architectural analysis **repeatable, reviewable, and scalable**.

## License

MIT. See `LICENSE`.
