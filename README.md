![Alma Design System mark](https://github.com/yamogoo/alma-design-system/blob/main/shared/images/logo-with-descriptor.svg)

# Alma Design System Monorepo

**Engineering showcase for frontend architecture and design systems.**  
AlmaDS demonstrates modern frontend practices — typed Vue components, design-token pipelines, modular SCSS architecture, and automated build/testing workflows.  
It is an **R&D sandbox** used to explore and document best practices in UI engineering rather than a production framework.

– Live docs: [alma-design-system.netlify.app](https://alma-design-system.netlify.app)  
– Case study: [Dribbble shot](https://dribbble.com/shots/26609294-Alma-Design-System)

---

## Overview

AlmaDS unifies components, tokens, compilers, and tooling into a reproducible monorepo (`pnpm workspace`).  
It serves as a **practical reference** for how to structure a scalable design-system environment with Vue 3, TypeScript, Storybook, and custom token automation.

Key achievements:

- Integrated all layers (tokens → components → apps) in a single workspace.
- Built `@alma/tokens-worker` — a compiler converting JSON token sources into CSS/SCSS artifacts.
- Delivered a live Storybook (Netlify) for tone × state × variant permutations.
- Automated lint/test/token builds (`pnpm prepare`, `pnpm ds:lint`, `pnpm ds:test:unit`).
- Reduced JS bundle > 70 % and CSS > 25 %, improving startup from 50 s → 7 s.

---

## Purpose

This repository exists as a **technical lab** —  
to test, document, and demonstrate engineering decisions around:

- token-based theming and pipelines,
- component architecture and composition,
- SCSS modularization and naming strategies,
- build/test automation for design-system environments.

It is experimental by design and evolves as new ideas are validated.

---

## Structure

```bash
apps/
  sparkpad/        # consumer playground
    client/        # frontend demo (Vite/Vue)
    server/        # API sandbox
    log-server/    # logging sink for experiments

packages/
  design-system/   # @alma/design-system – components, tokens, SCSS, stories
  tokens-worker/   # @alma/tokens-worker – token compiler (JSON → CSS/SCSS)

shared/
  images/          # branding reused across docs
```

Detailed architecture:  
`packages/design-system/MANIFEST.md` and `MANIFEST.yaml`

---

## Packages

### `@alma/design-system`

- Vue 3 + TypeScript component kit with atomic hierarchy.
- SCSS split into `abstracts/core/extends/mixins` with runtime entry `app.runtime.scss`.
- Code-first token source compiled into JSON bundles.
- Includes Pinia stores, composables, Storybook, and Vitest setup.

### `@alma/tokens-worker`

- Compiles relational token contracts into JSON, CSS variables, and SCSS maps.
- Developed initially by **Mikhail Grebennikov**; later expanded via AI-assisted prototyping under human supervision.

### `@alma/icons`

Standalone repo: [yamogoo/alma-icons](https://github.com/yamogoo/alma-icons)  
Provides multi-weight SVG icons used across AlmaDS components and docs.

---

## Apps

`apps/sparkpad` demonstrates how the system integrates into real projects:

- `client` — demo UI using the DS components.
- `server` — lightweight API sandbox.
- `log-server` — telemetry experiment backend.

All depend on local packages via pnpm workspaces.

---

## Getting Started

Requirements: Node 20+, pnpm 8+

```bash
git clone https://github.com/yamogoo/alma-design-system.git
cd alma-design-system

pnpm install:all
pnpm prepare

pnpm ds:lint
pnpm ds:test:unit
pnpm ds:build
pnpm ds:docs:dev          # Storybook → http://localhost:6006
pnpm sparkpad:client:dev  # demo UI → http://localhost:5041
pnpm sparkpad:server:dev  # API sandbox
```

More commands: see `package.json` scripts.

---

## Core Ideas

- **Tokens-first workflow:** edit JSON sources → compile artifacts via tokens-worker.
- **Adapters vs components:** adapters remain thin; logic resides in composables/components.
- **Testing:** Vitest + Vue Test Utils (`vitest.setup.ts`).
- **Storybook:** visual regression and token inspection environment.
- **Enterprise-style consumption:** product apps configure DS components via props/slots instead of forking.

---

## R&D Notes

Documented experiments and reversions:

- `stack.spacing-hybrid.core` removed (Oct 2025) — too heavy on CSS size.
- SCSS token service fields (`$value`, `$type`, `$unit`, `$respond`) restored (Oct 2025) to support proper responsive getters.

---

## License & Credits

**Author:** [Mikhail Grebennikov (@yamogoo)](https://github.com/yamogoo)  
Core design, architecture, and code authored by Mikhail Grebennikov.  
Select compiler modules were prototyped with AI assistance under direct supervision.

- Code: [MIT](./LICENSE)
- Icons & assets: [CC BY-NC 4.0](https://github.com/yamogoo/alma-icons)
