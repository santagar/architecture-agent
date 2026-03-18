# Repository Scoring

Use this prompt to generate a repeatable technical score.

```text
Evaluate the technical quality of this repository.

Select a scoring profile first:

- `service`
- `library`
- `iac`

Selection rule:

- infer profile from repository evidence by default
- if user provides profile explicitly, use user-provided profile
- if repository is mixed, use the dominant profile and document the tradeoff

Use a 0-10 scale per area:

- 0-3: weak or missing baseline
- 4-6: partial or inconsistent
- 7-8: solid baseline with manageable gaps
- 9-10: strong and systematic

IaC relevance rules (mandatory):

- Determine IaC coverage mode before scoring:
  - `direct`: IaC artifacts exist in repository (Terraform/Terragrunt/Kubernetes/Helm/Cloud templates/policy-as-code)
  - `indirect`: no direct IaC artifacts, but delivery/runtime/config dependency is evidenced via external repositories, CI/CD references, or deployment contracts
- If direct evidence is absent and indirect evidence is weak, still use `indirect` and mark gaps as `Not found in repository`.
- Always score IaC posture through area `IaC and deployment governance` using the selected mode (`direct` or `indirect`).
- Do not skip IaC scoring; if evidence is weak, score conservatively and mark missing points as `Not found in repository`.

Score from 0 to 10 and justify with repository evidence:

- architecture quality
- modularity and boundaries
- dependency hygiene
- testing strategy and coverage
- error handling and resilience
- maintainability and code health
- security baseline
- operability and observability
- delivery maturity (CI/CD and release safety)
- IaC and deployment governance
- documentation and metadata quality (README, diagrams, `catalog-info.yaml`, optional metadata extension)

Output format:

- Use `templates/repository-scorecard-template.md`.
- Fill `Scoring profile` and apply the corresponding weight preset.
- Fill the score table with one score, confidence, and short evidence note per area.
- Calculate the weighted overall score.
- Add top strengths, top risks, and 3 priority actions.
- Add `IaC coverage mode` (`direct` or `indirect`) with short rationale.
- Add `Context request to user` only if scoring is blocked by missing critical context.

Rules:

- Explain each score with repository evidence.
- If evidence is missing for an area, write `Not found in repository`.
- If an area is out of repository scope, mark it as `N/A` and explain why.
- If `N/A` is used, compute weighted overall score using remaining applicable weights normalized to 100.
- Keep judgments calibrated to the scoring scale.
- If critical context is missing for key scoring areas, add a `Context request to user` section with specific missing inputs.
- For `IaC and deployment governance`, always provide concrete evidence notes showing why mode is `direct` or `indirect`.
```
