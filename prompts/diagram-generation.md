# Diagram Generation

Use this prompt to create diagrams from the repository.

```text
Explain the architecture of this repository and produce diagrams using Mermaid.

Generate diagrams using this hierarchy:

- Mermaid sources in `docs/diagrams/sources/`
- Rendered SVGs in `docs/diagrams/rendered/`

Use this naming:

- `architecture-overview.mmd`
- `delivery-runtime.mmd` (if delivery/runtime can be inferred)
- `dependency-map.mmd` (if external dependencies exist)
- `execution-flow.mmd` (if trigger/request/event/cron flow can be inferred)
- `execution-flow-sync.mmd` (optional when sync request/response is first-class)
- `execution-flow-async.mmd` (optional when async/cron/event flow is first-class)

Include:

- service components
- databases
- external systems
- data flow
- deployment structure

Output format:

1. Diagram inventory (name and path)
2. Mermaid source path per diagram (`docs/diagrams/sources/*.mmd`)
3. Rendered SVG path per diagram (`docs/diagrams/rendered/*.svg`)
4. Diagram summary path (`docs/diagrams/diagram-generation.md`)
5. Renderer pre-check status (`mmdc` available or missing)
6. SVG rendering status per diagram (`rendered` or `renderer-not-available`)
7. Short explanation per diagram
8. Open gaps (`Not found in repository`) when a diagram cannot be inferred
9. `Context request to user` (only if critical context is missing)

Rules:

- Do not invent components not supported by repository evidence.
- Create `docs/diagrams/sources/` and `docs/diagrams/rendered/` if they do not exist.
- Create or update `docs/diagrams/diagram-generation.md` as the human-readable diagram index.
- Generate both `.mmd` and `.svg` for each inferred diagram.
- Run renderer pre-check first (`mmdc --version` or `npx mmdc --version`).
- Use the available Mermaid renderer in the environment (for example Mermaid CLI `mmdc`) to generate SVG files.
- If renderer is missing, stop SVG generation and return a `Context request to user` with install/enable instructions.
- If SVG rendering is not possible after pre-check, still generate `.mmd` and explicitly report the rendering limitation.
- If a diagram type cannot be built from evidence, write `Not found in repository` for that diagram.
- Add a short explanation for each generated diagram.
- If critical context is missing (for example external deployment manifests), add a `Context request to user` section with exact fields to provide in chat.
- For execution-flow coverage, prioritize relevance over exhaustiveness.
- Build execution-flow diagrams as grouped flow sets after repository analysis:
  - sync flows (request/response)
  - async flows (events/queues)
  - scheduled flows (cron/jobs)
- Select only the most important flows (recommended 3-5) using evidence-based criteria:
  - business impact
  - operational risk/failure impact
  - frequency/traffic criticality
  - integration criticality (cross-service/data dependencies)
- Keep non-prioritized flows out of diagram scope and list them in `docs/diagrams/diagram-generation.md` as `out-of-scope`.
- Use deterministic diagram style by type:
  - `architecture-overview`: `flowchart LR` with `subgraph` groups for service internals, data stores, and external systems.
  - `dependency-map`: `flowchart LR` with `subgraph` groups by dependency boundary (in-repo modules, internal platform services, external providers).
  - `delivery-runtime`: `flowchart LR` with `subgraph` groups for `CI/CD pipeline (<tool>)`, optional `Artifact registry`, and `Runtime platform (<target>)`.
  - `execution-flow`: `sequenceDiagram` when sync request/response is primary; `flowchart LR` when async/cron/event is primary.
- If both sync and async flows are first-class, keep `execution-flow.mmd` as a prioritized overview and add `execution-flow-sync.mmd` / `execution-flow-async.mmd` as needed.
- In `execution-flow` sequence diagrams, group participants by domain using Mermaid `box` blocks (for example Client, Service, Data/External).
- In `execution-flow` async flowcharts, group nodes with `subgraph` blocks such as Trigger, Processing, and Side effects/dependencies.
- In `delivery-runtime`, keep stage nodes inside the pipeline subgraph in execution order and connect `pipeline -> registry -> runtime` with explicit edges.
```
