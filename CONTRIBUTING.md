# Contributing to Lattix

## Development Workflow

1. Run `corepack enable` and `pnpm dev:setup` from the repository root.
2. Create a focused branch and use Conventional Commits.
3. Run `pnpm ci:local` before opening a pull request.
4. Include tests and documentation for behavior or contract changes.

## Pull Requests

Pull requests must be reviewable, pass required checks, avoid committed secrets, and describe operational or migration impact. Changes to architecture, security boundaries, public APIs, data contracts, or cloud topology require an ADR update.

## Security

Do not open public issues for suspected vulnerabilities. Follow `SECURITY.md` for private reporting.
