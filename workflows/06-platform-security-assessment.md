# Workflow 06: Platform Security Assessment

## Goal

Assess the security posture of a platform in a staged way, starting from the public attack surface and then drilling down into internal repositories, components, and delivery/runtime boundaries.

The workflow is designed to produce:

- executive-first assessment reports
- a security score aligned to standard control areas
- short evidence-based findings and triggered next checks
- follow-up deep-dive scope for internal repositories and components

## Scope model

Execute in two phases:

1. `perimeter`: public-facing surface first
2. `internal`: repository-by-repository or component-by-component deep dive after perimeter findings are known

Input source modes:

- `public-surface`: work from public URLs, domains, endpoints, docs, and observable exposure without requiring repository code
- `repository`: work from one or more repositories/components already in scope
- `hybrid`: start from public exposure and then connect findings to repositories/components and shared platform controls

Default behavior:

- if `source-mode` is omitted, default to `public-surface`
- if the request is broad or exploratory, start with `phase=perimeter`
- if public entry points are already known, enumerate them explicitly before assessing deeper internals
- if the platform contains multiple repositories/services, use `workflows/05-solution-landscape.md` first when service boundaries are unclear

## Safety and authorization gate

- do not perform intrusive or destructive actions
- do not exploit vulnerabilities
- do not run denial-of-service patterns, credential attacks, bypass attempts, or high-volume scans
- only use passive evidence, repository evidence, configuration evidence, already-authorized commands, and low-risk verification steps
- if testing authority, target list, or environment boundaries are unclear, stop and return `Context request to user`

## Sequence

1. Start with `Launch recommendations`:
   - confirm `source-mode` (`public-surface`, `repository`, or `hybrid`)
   - confirm platform/product scope
   - confirm authorized perimeter targets (domains, APIs, public apps, ingress points)
   - request or consume Kubernetes / IaC publication evidence when available (`Ingress`, `Gateway`, `Service`, `HTTPRoute`, `VirtualService`, `Helm values`, `NetworkPolicy`, `ExternalDNS`, `Certificate`)
   - request or consume cloud security evidence when available (for example ALB/NLB/API Gateway/CloudFront/CDN/WAF, IAM, Secrets Manager, security groups, storage exposure, audit/detection controls)
   - confirm output language if not explicit
   - confirm whether repository deep dives are in scope now or later
   - if repository boundaries are unclear, suggest `workflows/05-solution-landscape.md` first
2. Define assessment phase:
   - `perimeter`: public exposure, discovery surface, auth edges, headers, TLS, internet-facing endpoints, public docs, public assets
   - `internal`: repository-by-repository review of code, IaC, configuration, delivery, secrets handling, and runtime assumptions
3. Run `prompts/perimeter-security-review.md` for `Battery A`.
4. For `perimeter`, inventory these evidence areas when present:
   - public domains and subdomains explicitly provided by the user
   - Kubernetes / IaC evidence that defines public exposure, such as `Ingress`, `Gateway`, `HTTPRoute`, `VirtualService`, `Service`, `Helm values`, `Certificate`, `ExternalDNS`, and `NetworkPolicy`
   - publication-model details inferred from IaC/manifests: internet-facing vs internal, `80/443` listeners, redirect policy, TLS policy, certificate attachment, backend protocol, host rules, and edge ownership boundaries
   - cloud publication and edge evidence: ALB/NLB/API Gateway/CloudFront/CDN/WAF, public IPs, DNS delegation, certificate services, redirect/TLS posture, and public storage or edge exposure clues
   - cloud control evidence: IAM/workload identity, secrets management, network boundaries, audit/detection controls, and storage/data exposure controls when available
   - exposed APIs and routes evidenced in docs, gateway config, OpenAPI, Postman, ingress, reverse proxy, load balancer, or frontend code
   - authentication entry points, session flows, callback URLs, and token issuance/validation boundaries
   - HTTP/TLS posture, security headers, CORS, cookie flags, caching, and error exposure
   - external attack-surface clues in public documentation or repository evidence
   - if `source-mode=public-surface`, do not require repository code before producing the perimeter report
5. Score `Battery A` using `templates/platform-security-scorecard-template.md`.
6. Trigger next checks based on observed exposure:
   - visible API/OpenAPI/Redoc -> recommend `Battery B` API or repository deep dive
   - visible login, checkout, or user journeys -> recommend journey-focused review and auth/session validation
   - visible host/service endpoints -> recommend approved low-risk active checks only when explicitly authorized (for example headers, TLS, low-volume port validation)
   - visible white-label or tenant surfaces -> recommend tenant/isolation and platform architecture review
   - if manifests show exposure is intentional and aligns with a valid platform pattern (for example AWS ALB `80/443` plus redirect to `443`), do not score the mere exposure as a finding; instead validate edge controls around that exposure
7. Run `prompts/repository-security-deep-dive.md` for `Battery B` on each prioritized repository/component.
8. For `internal`, review these evidence areas repository by repository:
   - secret handling and credential exposure risks
   - authentication and authorization controls
   - dependency and supply-chain posture
   - network trust boundaries and service-to-service assumptions
   - IaC, CI/CD, runtime hardening, and observability controls
9. If repository-level delivery/runtime or deployment evidence matters, run `prompts/iac-review.md`.
10. If cloud edge, IAM, secrets, networking, storage, or detection controls materially affect the posture, run `prompts/cloud-security-posture-review.md`.
11. If repository-level reliability/security posture matters, run `prompts/security-operability.md`.
12. Run `prompts/platform-security-architecture.md` for `Battery C` when platform-wide consolidation is needed.
13. If platform boundaries or repository roles are unclear, run `prompts/platform-engineering.md` or `workflows/05-solution-landscape.md` before final conclusions.
14. Structure the main assessment with `templates/platform-security-assessment-template.md` and write `docs/reviews/security/platform-security-assessment.md`.
15. Write the score summary with `templates/platform-security-scorecard-template.md` and save `docs/reviews/security/platform-security-scorecard.md`.
16. Optionally write `docs/reviews/security/perimeter-security-review.md` for `Battery A` when perimeter evidence is the main initial deliverable.
17. Optionally write `docs/reviews/security/repository/<repo-name>-security-review.md` for each `Battery B` deep dive.
18. Capture the durable finding inventory with `templates/security-findings-register-template.md` and write `docs/reviews/security/security-findings-register.md`.
19. Capture prioritized remediation sequencing with `templates/security-remediation-plan-template.md` and write `docs/reviews/security/security-remediation-plan.md`.
20. Capture security debt backlog and execution order using `templates/technical-debt-report-template.md`.
21. Create or update `docs/meta.json` using `templates/docs-meta-template.json` and write a full execution record to `docs/meta/history/<timestamp-or-id>.json` with source mode, targets, and launch context.

## Expected outputs

- platform perimeter assessment report
- platform security scorecard
- security findings register
- short evidence-based findings
- security score and maturity band
- prioritized remediation plan
- explicit next-step deep-dive plan for internal repositories/components
- debt register entries and execution sequence
- execution metadata in `docs/meta.json`

## Definition of Done

- Public entry points in scope are listed explicitly or marked as `Not found in repository`.
- `public-surface` assessments can complete without repository code when perimeter evidence is sufficient.
- Kubernetes / IaC publication evidence is treated as first-class perimeter context when available and is used to distinguish expected exposure from misconfiguration.
- Cloud edge, IAM, secrets, networking, storage, and audit/detection evidence are treated as first-class security context when available.
- Findings are concise, evidence-first, and limited to the highest-signal issues.
- A security score and maturity band are documented with confidence notes.
- Findings are captured in a durable register with status-ready tracking fields.
- Recommendations are tied to triggered next checks and next batteries.
- Follow-up deep-dive targets are identified for internal repositories, services, or shared platform components.
- Unknown or inaccessible evidence is marked as `Not found in repository`.
- `docs/meta.json` is updated as the latest snapshot and points to a full execution record under `docs/meta/history/`.
- One primary language is used consistently across each generated artifact when `Output language` is specified.

## Documentation usage notes

- Start with perimeter-first unless there is a strong reason to begin internally.
- Keep the workflow non-intrusive and authorization-aware.
- Prefer evidence-driven conclusions over generic security checklists.
- Use this workflow to drive both immediate remediation and a deeper repository-by-repository security roadmap.
- If a platform contains many repositories, combine this workflow with `05` for system mapping and then reuse `01` or direct prompts for high-risk repositories.

## Real usage example

A platform team wants to assess the security posture of the `payments-platform` starting from all internet-facing entry points and then go deeper into the API gateway, checkout frontend, and payment orchestration service.

Prompt execution in this scenario:

1. Run `workflows/06-platform-security-assessment.md`.
2. Set source mode: `public-surface`.
3. Set platform scope: `payments-platform`.
4. Set perimeter scope: `pay.example.com`, `api.example.com`, `checkout.example.com`.
5. Run `prompts/perimeter-security-review.md`.
6. Record severity, criticality, and prioritized remediations.
7. Select the highest-risk repositories/components for `phase=internal`.
8. Switch to `source-mode=hybrid` or `source-mode=repository` when repository-level evidence is available.
9. Run `prompts/repository-security-deep-dive.md` plus repository-level security and IaC reviews where evidence requires deeper validation.
10. Run `prompts/platform-security-architecture.md` to consolidate systemic risk and shared-control actions.

Concrete outputs expected:

- perimeter exposure report
- security findings register
- prioritized vulnerability and hardening actions
- internal deep-dive queue ordered by risk

## When not to use this workflow

- when you need only a repository-local architecture/doc lifecycle; use `workflows/01-documentation-lifecycle.md`
- when the request is a code change rather than a security assessment; use `workflows/02-change-request.md`
- when you only need a multi-repo architecture view without security posture; use `workflows/05-solution-landscape.md`
