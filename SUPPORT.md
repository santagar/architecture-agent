# Support

## Where to ask

- Usage questions and improvements: GitHub Issues
- Bugs: GitHub Issues (bug template)
- Security reports: follow `SECURITY.md`

## What to include

- command executed
- full CLI output
- expected result
- current repository context (service type, stack, constraints)
- package version (`npm view @santagar/architecture-agent version`)

## Troubleshooting baseline

```bash
npx architecture-agent help launch
npx architecture-agent list workflows
npx architecture-agent launch workflow 01 --mode update --git-scope origin/main~1..origin/main
```
