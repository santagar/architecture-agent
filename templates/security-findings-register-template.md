# Security Findings Register

## Context

Platform, repository, or component under review:
Date:
Playbook version:
Assessment phase:
Source mode:
Scope:

## Findings register

| ID | Area | Finding | Severity | Business criticality | Exposure surface | Evidence | Recommended action | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-001 |  |  | critical/high/medium/low | critical/high/medium/low | perimeter/repository/platform/external |  |  |  | open |

## Grouping notes

- `perimeter`: public domains, APIs, apps, ingress, auth edges, headers, TLS, and exposed assets
- `repository`: code, secrets handling, auth/authz, dependencies, CI/CD, IaC, runtime controls
- `platform`: cross-service trust boundaries, shared components, identity, gateways, delivery/runtime controls
- `external`: third-party providers, externally managed dependencies, and trust relationships outside direct repository ownership

## Triage notes

- mark evidence gaps as `Not found in repository`
- keep one row per finding so remediation and tracking stay auditable
- update `Status` over time (`open`, `accepted-risk`, `in-progress`, `mitigated`, `deferred`)

## Open questions

Capture unknowns as `Not found in repository` and list what is needed to close them.
