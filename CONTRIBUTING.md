# Contributing

Thanks for contributing to `@santagar/architecture-agent`.

## Scope

This repository contains:

- prompts (`prompts/`)
- workflows (`workflows/`)
- templates (`templates/`)
- CLI launcher and packager (`bin/`, `lib/`, `scripts/`)

Contributions should improve operational quality, consistency, or usability.

## Quick setup

```bash
npm install
npm run build
npm run test
npm run lint:md
```

## Contribution rules

1. Keep prompts/workflows evidence-based and operational.
2. Do not add capabilities that the playbook cannot actually execute.
3. Keep naming stable; if you rename assets, update CLI aliases and README references.
4. Preserve backward compatibility for CLI commands unless a breaking change is intentional and documented.
5. Keep examples short and production-realistic.

## Pull request checklist

1. Add/update documentation for user-facing changes.
2. Run `npm run build`, `npm run test`, and `npm run lint:md` locally.
3. Update `CHANGELOG.md` under `Unreleased`.
4. If package behavior changes, include at least one CLI smoke test case.

## Versioning

This project follows SemVer:

- patch: fixes, docs, non-breaking UX improvements
- minor: new non-breaking CLI/workflow capabilities
- major: breaking behavior changes

## Release flow

1. Merge changes into `main`.
2. Bump package version (`npm version patch|minor|major`).
3. Push commit and tag (`git push --follow-tags`).
4. GitHub Actions publishes if version is new.
