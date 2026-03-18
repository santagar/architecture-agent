# <Service or Repository Name>

One-line summary of what it does.

## 1. Service snapshot

### Overview

What problem does it solve? What are the main system boundaries?

### Ownership and status

Who owns it? How critical is it? What is its current lifecycle status?

### Prerequisites

Required runtimes, tools, access, and secrets needed before running locally.

### Quick start

Minimum steps to run and validate the system.

## 2. Architecture and system context

### Architecture

Describe the overall structure and main components.

### Architecture diagrams

Reference architecture diagrams with source and rendered links in a table.

Use this table format:

| Diagram | Purpose | Source (.mmd) | Rendered (.svg) | Status |
| --- | --- | --- | --- | --- |
| architecture-overview | High-level structure and boundaries | [source](docs/diagrams/sources/architecture-overview.mmd) | [rendered](docs/diagrams/rendered/architecture-overview.svg) | required when diagrammable |
| delivery-runtime | Delivery pipeline and runtime topology | [source](docs/diagrams/sources/delivery-runtime.mmd) | [rendered](docs/diagrams/rendered/delivery-runtime.svg) | required when evidence exists |
| dependency-map | Internal/external dependency landscape | [source](docs/diagrams/sources/dependency-map.mmd) | [rendered](docs/diagrams/rendered/dependency-map.svg) | required when dependencies exist |
| execution-flow | Prioritized flow overview | [source](docs/diagrams/sources/execution-flow.mmd) | [rendered](docs/diagrams/rendered/execution-flow.svg) | optional |
| execution-flow-sync | Sync flow detail | [source](docs/diagrams/sources/execution-flow-sync.mmd) | [rendered](docs/diagrams/rendered/execution-flow-sync.svg) | optional |
| execution-flow-async | Async/scheduled flow detail | [source](docs/diagrams/sources/execution-flow-async.mmd) | [rendered](docs/diagrams/rendered/execution-flow-async.svg) | optional |

Rules:

- use relative links
- if a diagram is missing, write `Not found in repository` in source/rendered cells
- keep a short purpose description per row
- keep extended notes in `docs/diagrams/diagram-generation.md`

Grouping policy:

- `architecture-overview`: group by service internals, data stores, and external systems
- `dependency-map`: group by dependency boundary (in-repo modules, internal platform services, external providers)
- `delivery-runtime`: group by `CI/CD pipeline (<tool>)`, optional `Artifact registry`, and `Runtime platform (<target>)`
- `execution-flow` sync: group participants by domain using Mermaid `box`; async/scheduled: group by trigger/processing/side effects using `subgraph`
- `execution-flow` scope: prioritize the most relevant flows (recommended 3-5) by business impact, operational risk, frequency, and integration criticality; list non-prioritized flows in `docs/diagrams/diagram-generation.md` as out-of-scope

### Solution landscape (optional, multi-repo)

Reference solution-level documentation when this repository is part of a broader system.

Recommended convention:

- solution narrative: `docs/solution/solution-landscape.md`
- solution diagrams source folder: `docs/solution/diagrams/sources/`
- solution diagrams rendered folder: `docs/solution/diagrams/rendered/`

Rule:

- if this repository is documented as part of a multi-repository system, link this section from the README using relative paths

### Module responsibilities

List the main modules and what each one owns.

### Main flows

Describe request flow, event flow, or data flow.

### Interfaces and integrations

List APIs, events, databases, and key external systems.

## 3. Build, run, and operate

### Configuration

Document environment variables, config files, secrets approach, and runtime assumptions.

### Running locally

Detailed local execution notes beyond quick start.

### Testing

How to run tests and what test strategy exists.

### Operations

Monitoring, logging, deployment, and operational notes.

### Operational deep dives (optional)

Preserve high-value operational details that are still valid and useful for on-call, platform, or maintenance work.

Selection criteria (agnostic to repository type):

- keep details that are actionable, hard to infer, and likely to be needed during operation, troubleshooting, maintenance, or change execution
- prioritize details that affect safety, reliability, recoverability, compliance, or delivery predictability
- include only evidence-backed content present in the repository

Rule:

- if these details are long, keep a concise summary in README and link to detailed files under `docs/operations/`
- if a detail fits an existing section (`Configuration`, `Testing`, `Operations`, `Interfaces and integrations`), place it there first

## 4. Quality, evolution, and decisions

### Maintenance hotspots

Which modules or flows are fragile, high-change, or operationally risky?

### Known limitations

Document important caveats, debt, or fragility.

### Technical debt status

Declare one explicit state:

- `No technical debt identified at this time` (based on current repository evidence), or
- `Technical debt identified` with:
  - link to `docs/reviews/security/technical-debt-report.md` (if present)
  - short summary of top debt items in README

Rule:

- never leave this section ambiguous; always state one of the two statuses
- if debt report does not exist, write `Not found in repository`

### Next improvements

List the most useful next steps.

### Change execution notes

Which safe incremental changes should happen first?

### Preserved operational notes (from previous README)

Capture only high-value information from a previous README that is still valid but does not fit any section above.

Rules:

- if content maps to an existing section, move it there instead of duplicating it here
- keep only actionable operational details (for example runtime caveats, rollout constraints, compatibility warnings)
- exclude stale, redundant, or low-value historical text

### Conclusions

Short synthesis of current posture, priority risks, and recommended next actions.

### Open questions

What cannot be confirmed from repository contents?
