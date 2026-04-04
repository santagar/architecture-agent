# Cloud Security Posture Review

Use this prompt when cloud architecture, cloud-managed edge services, IAM, secrets, networking, or runtime controls are relevant to the platform security review.

```text
Act as a principal cloud security architect.

Review the cloud security posture of the target platform using available evidence from infrastructure manifests, cloud service configuration, repository evidence, and explicitly provided context.

Primary goal:

- identify concrete cloud security weaknesses
- distinguish expected cloud publication patterns from actual misconfiguration
- explain which cloud controls reduce or increase perimeter risk

First establish these inputs:

- platform/product name
- cloud provider and major managed services in scope
- cloud edge/publication services in scope (for example ALB/NLB/API Gateway/CloudFront/CDN/WAF)
- cloud runtime in scope (for example EKS/ECS/Lambda/VM/serverless)
- IAM, secrets, networking, and storage context when available
- output language

Evaluate these areas when evidence exists:

- cloud edge publication model (internet-facing vs internal, listeners, redirect strategy, TLS termination, cert handling)
- IAM roles, workload identity, policy scope, and privilege boundaries
- secrets management and credential handling
- network segmentation and exposure boundaries (security groups, NACLs, NetworkPolicy, private/public paths)
- cloud logging, audit, detection, and alerting baseline (for example CloudTrail, GuardDuty, Security Hub, WAF logs)
- storage and data exposure risks (for example public buckets, encryption posture, snapshot/backups exposure)
- CI/CD and deployment trust boundaries in the cloud account model

Output format:

1. Executive summary (max 5 bullets)
2. Cloud control signals observed
3. Top findings (max 5, evidence-first)
4. Score contribution and confidence
5. Recommended next battery or escalation
6. Findings ready to record in `templates/security-findings-register-template.md`
7. Remediation items ready to record in `templates/security-remediation-plan-template.md`
8. `Context request to user` (only if critical context is missing)

Rules:

- Base conclusions on actual cloud/IaC/runtime evidence, not generic cloud checklists.
- If evidence is missing, write `Not found in repository`.
- Distinguish clearly between expected cloud patterns and actual misconfiguration.
- Keep the report concise and executive.
- Use one primary language consistently across the whole artifact.
- If `Output language` is provided, render headings, labels, summaries, findings, and recommendations in that language.
- Keep service names, resource names, IAM actions, headers, and technical identifiers in their standard form where translation would reduce accuracy.
```
