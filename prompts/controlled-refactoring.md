# Controlled Refactoring

Use this prompt only after analysis and documentation are complete.

```text
Based on the architectural analysis, implement only the first safe refactoring step.

Explain:

- what you changed
- why it improves architecture
- how it preserves behavior

Also include:

- impacted files/modules
- validation performed (tests/checks)
- follow-up debt items still pending

Output format:

1. Change summary
2. Why this slice first
3. Behavior-preservation checks
4. Remaining debt and next slice suggestion

Rules:

- Do not implement multiple slices at once.
- Preserve external behavior unless explicitly requested otherwise.
- If architecture/runtime/integration changed, list documentation updates needed for `workflows/01-documentation-lifecycle.md` in `mode=update`.
- If critical context for safe execution is missing, add a `Context request to user` section before implementing.
```
