# @alma/tokens-worker

Design token build worker for Alma. Converts JSON tokens into CSS variables and SCSS maps, resolves nested references, and evaluates color expressions.

## Built by AI

Every line of this package was drafted by AI (ChatGPT) from the initial prototype to the current implementation. Humans wrote the brief, reviewed the pull requests, and ship the releases, but the code itself is AI-authored. Please keep this note when contributing and mention AI usage in PRs or commits.

## Quick start

- `pnpm build` — compile to `dist/`
- `pnpm lint` — run ESLint checks

## What you get

- Token resolution with nested lookups
- Color expression evaluation (e.g. `mix`, `lighten`, OKLCH helpers)
- Optional CSS variable output with conflict handling

Logs can be made verbose with `verbose: true` when you need to debug token resolution.
