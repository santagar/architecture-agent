# Infrastructure as Code Review

Use this prompt for Terraform, Pulumi, CloudFormation, Helm, Kubernetes manifests, or similar infrastructure repositories.

```text
Act as a cloud infrastructure architect.

Review the Infrastructure as Code posture for this repository (direct artifacts and/or indirect deployment dependencies).

First classify IaC coverage mode:

- `direct`: IaC artifacts are present in this repository
- `indirect`: IaC is external but deployment/runtime/config dependency is evidenced via CI/CD, docs, or external repo references

Evaluate:

- infrastructure structure
- environment separation
- security configuration
- secrets management
- networking model
- scalability patterns
- operational risks

Output format:

1. IaC structure and environment model
2. IaC coverage mode (`direct` or `indirect`) with evidence
3. Security and secrets findings
4. Networking and runtime risk findings
5. Prioritized remediation actions
6. Debt items for `templates/technical-debt-report-template.md`
7. `Context request to user` (only if critical context is missing)

Rules:

- Suggest improvements based on repository evidence.
- Prioritize security and operational risks first.
- If something cannot be confirmed, write `Not found in repository`.
- Always return mode (`direct` or `indirect`), never omit coverage mode.
- If critical IaC context is missing (for example manifests/charts in another repository), add a `Context request to user` section.
```
