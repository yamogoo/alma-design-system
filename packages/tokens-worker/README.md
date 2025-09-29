# @alma/tokens-worker

Lightweight token build/parsing toolkit used to assemble JSON design tokens into SCSS maps and CSS variables, resolve nested references, evaluate color expressions, and generate theme bundles.

## AI Assistance Disclosure

This package (parsers and supporting build utilities) was implemented with the assistance of AI tools (ChatGPT). The overall architecture, requirements, and interfaces were defined by a human author; AI was used to draft and iterate on the implementation. The resulting code was reviewed and adapted for this project.

If you contribute changes, please keep this disclosure and note in your commit messages when AI assistance is used.

## Scripts

- `pnpm build` — compile TypeScript to `dist/`
- `pnpm lint` — run ESLint

## Notes

- The parser supports nested token references, file-structure lookup, color expressions (e.g., `rgba()`, `lighten()`, `darken()`), and optional CSS variable emission with conflict resolution.
- Verbose logging can be enabled with `verbose: true` to surface diagnostics during token resolution.
