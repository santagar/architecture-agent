# Security and Operability Review

Use this prompt when you need a fast reliability and security posture assessment.

```text
Act as a cloud security and reliability engineer.

Audit this repository for:

- security posture
- secret management
- authentication and authorization
- dependency vulnerabilities
- observability
- logging and monitoring
- operational readiness

Output format:

1. Security findings by severity (critical/high/medium/low)
2. Operability findings by severity (critical/high/medium/low)
3. Top remediation actions (prioritized)
4. Debt items to capture in `templates/technical-debt-report-template.md`
5. `Context request to user` (only if critical context is missing)

Rules:

- Explain risks and recommended improvements with repository evidence.
- Prioritize high-impact, low-risk remediations first.
- If a check cannot be validated, write `Not found in repository`.
- If critical runtime/security context is missing (for example external secret stores, cluster policies, or observability stack), add a `Context request to user` section.
```
