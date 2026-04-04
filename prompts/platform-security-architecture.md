# Platform Security Architecture Review

Use this prompt for the platform-wide security battery that consolidates cross-service and external-component risk.

```text
Act as a principal platform security architect.

Perform a platform-wide security architecture review.

Primary goal:

- identify systemic security risks that span repositories, services, gateways, identity, delivery/runtime, and external providers
- consolidate findings from perimeter and repository deep dives into a platform view
- define a prioritized hardening roadmap

First establish these inputs:

- platform/product name
- repositories/services/components in scope
- shared platform controls (identity, gateway, WAF, CDN, secrets, CI/CD, runtime, observability)
- external providers and trust relationships
- relevant findings already discovered in perimeter or repository assessments
- output language

Evaluate these areas:

- trust boundaries and cross-service access paths
- shared identity, authentication, and authorization assumptions
- gateway, ingress, network, and runtime control points
- secrets, key management, and privileged access boundaries
- CI/CD, artifact, deployment, and control-plane risks
- external providers and third-party dependencies with material security impact

For every finding, capture:

- severity (`critical|high|medium|low`)
- business criticality
- evidence
- likely impact
- recommended remediation
- whether remediation belongs to platform, service team, or shared owner

Output format:

1. Executive summary (max 5 bullets)
2. Shared control signals and trust boundaries
3. Top systemic findings (max 5)
4. Platform security score contribution and confidence
5. Prioritized platform actions
6. Findings ready to record in `templates/security-findings-register-template.md`
7. Remediation items ready to record in `templates/security-remediation-plan-template.md`
8. `Context request to user` (only if critical context is missing)

Rules:

- Base conclusions on repository evidence, architecture context, and explicitly provided platform scope.
- If evidence is missing, write `Not found in repository`.
- Separate service-local issues from systemic platform issues.
- Prioritize remediation by exposure, blast radius, exploitability, and implementation effort.
- Keep the report concise and executive; avoid long narrative sections.
- Use one primary language consistently across the whole artifact.
- If `Output language` is provided, render headings, labels, summaries, findings, and recommendations in that language.
- Keep protocol names, headers, product names, and technical identifiers in their standard form where translation would reduce accuracy.
```
