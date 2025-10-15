![Alma Design System mark](https://github.com/yamogoo/alma-design-system/blob/main/shared/images/logo-with-descriptor.svg)

# Alma Design System Monorepo

**Token-centric architecture.**  
All design decisions, from colors and motion to component spacing and interaction states, originate from relational design tokens compiled into consumable JSON, CSS, and SCSS artifacts. Components are secondary consumers — they simply express token logic through UI.  
**New:** primitive mode management (`precompile`, `runtime`, `hybrid` placeholder) and runtime theme animations are driven directly by motion tokens. The system is moving toward a hybrid model today with a runtime-first model next.

Code-first R&D space for UI systems: Vue components, design tokens, adapters, Storybook tooling, and consumer playground apps.

– Live docs: https://alma-design-system.netlify.app

## Results & Impact

- Unified components, tokens, adapters, and tooling into a single monorepo with reproducible installs (`pnpm workspace`).
- Designed and shipped `@alma/tokens-worker`, a custom compiler that turns relational token contracts into consumable JSON/CSS artifacts.
- Introduced the UI Facets map and global namespace exports, simplifying consumption of organisms/templates across apps.
- Delivered a live Storybook deployment (Netlify) with matrices for testing tone × state permutations, enabling async design/dev reviews.
- Established portable lint/test scripts (`pnpm ds:lint`, `pnpm ds:test:unit`) and token build automation (`pnpm prepare`).

## Why This Exists

Alma Design System is a laboratory for testing component architecture, token pipelines, theming strategies, and design-to-code workflows. It is intentionally experimental and subject to breaking changes while ideas are validated. The ultimate goal — to evolve into a **production-ready DS toolkit** demonstrating enterprise-grade runtime theming and motion-token architecture.

## Monorepo Layout

```bash
apps/
  sparkpad/        # consumer playground
    client/        # frontend demo experience
    server/        # API sandbox
    log-server/    # logging sink for experiments

packages/
  design-system/   # @alma/design-system entry point (components, tokens, SCSS, stories)
  tokens-worker/   # @alma/tokens-worker compiler that materializes token outputs

shared/
  images/          # branding reused across docs
```

Detailed architecture lives in:

- `packages/design-system/MANIFEST.md`
- `packages/design-system/MANIFEST.yaml`

## Packages

### `@alma/design-system` (`packages/design-system`)

- Vue 3 + TypeScript component kit with atomic structure.
- SCSS core split into abstracts/core/extends/mixins with consumer runtime entry `app.runtime.scss`.
- Code-first token source (`src/tokens/src`) compiled into JSON bundles (`src/tokens/output`).
- Pinia stores, composables, utilities, Storybook stories, and Vitest setup.

### `@alma/tokens-worker` (`packages/tokens-worker`)

- Processes token sources, resolves relational contracts, and emits consumable artifacts.
- Provides parsers/plugins for JSON, CSS variables, and SCSS maps.

> Note on development:
> The TokensWorker module started as a hand-written prototype by Misha Grebennikov.
> As the project matured, the workflow shifted toward architectural oversight and automated code generation, keeping the compiler aligned with the broader system design.
> AI-assisted generation was limited to this compiler; every other package, component, and infrastructure layer in the monorepo is authored directly by Misha.

### `@alma/icons` (dedicated repository)

- Authored and maintained by Misha Grebennikov in a standalone repository: [yamogoo/alma-icons](https://github.com/yamogoo/alma-icons)
- Exposes multi-weight SVG icons as a standalone package.
- Integrated into the design system as a dependency for icon components and Storybook previews.

## Apps

`apps/sparkpad` demonstrates integration of the design system through:

- `client`: Vite/Vue consumer UI.
- `server`: lightweight API sandbox.
- `log-server`: auxiliary service for telemetry experiments.

These apps depend on the local packages via pnpm workspaces.

> Files that include contributions generated or assisted by AI are explicitly annotated at the top with:
> // Portions of this file were developed with the assistance of AI tools.

## Getting Started

Prerequisites: Node 20+, pnpm 8+.

```bash
git clone https://github.com/yamogoo/alma-design-system.git
cd alma-design-system

pnpm install:all          # install workspace dependencies
pnpm prepare              # bootstrap generated assets (tokens, types)

pnpm ds:lint              # lint @alma/design-system
pnpm ds:test:unit         # unit testing @alma/design-system
pnpm ds:build             # build @alma/design-system
pnpm ds:docs:dev          # start Storybook (http://localhost:6006)
pnpm sparkpad:client:dev  # run Sparkpad client demo (http://localhost:5041)
pnpm sparkpad:server:dev  # run Sparkpad API sandbox
```

> Need more? See `package.json` scripts for additional commands (tests, lint, analytics).

## Key Concepts

- **Tokens-first workflow**: edit JSON contracts in `packages/design-system/src/tokens/src`, then run the worker to regenerate outputs.
- **Adapters vs components**: adapters stay thin and map UI into host app contexts; heavy logic belongs to components/composables.
- **Testing**: Vitest + Vue Test Utils with jsdom, configured via `packages/design-system/vitest.setup.ts`.
- **Storybook**: used for regression demos and token inspection (`pnpm ds:docs:dev`).
- **Enterprise consumption pattern**: consumer apps (e.g., Sparkpad) configure existing design-system components via public props, slots, and presets—mirroring how large companies keep product teams from forking the DS.

## Roadmap Snapshots

- Token path linter and contrast validation for relational contracts.
- Matrix stories covering role × tone × state permutations.

## Optimization Highlights

- Reduced JS bundle: 1+ MB → 215.38 kB (gzip: 52.75 kB −76 %)
- Reduced CSS bundle: 400 KB → 285.64 kB (gzip: 20.92 kB)
- Improved dev-server startup: 50 s → 7 s (−86 %)
- Built runtime token pipeline with a code-first single source of truth
- Established deterministic theming across light/dark and five facets (variant/size/mode/tone/state)
- Added motion tokens (`duration`, `easing`) that power theme-transition animations in runtime mode and laid the groundwork for hybrid → runtime execution flows.

### R&D Notes — Abandoned Experiments

This section documents experimental utilities and architectural ideas that were tested but not adopted for production — along with decisions on reverted or refined implementations.

- **(deprecated)** `stack.spacing-hybrid.core` — universal responsive spacing utility _(Oct 12 2025)_.  
  Increased CSS size by +400 % (≈240 KB → 1 MB+) with negligible runtime benefit.  
  Replaced by a token-driven preset model for better performance and maintainability.

- **(reverted)** SCSS token map service fields (`$value`, `$type`, `$unit`, `$respond`) _(Oct 12 2025)_ —  
  the explicit storage of these metadata fields in compiled maps was **restored** to enable a proper `$respond` getter (defaulting to `$value`).  
  Backward compatibility was preserved: maps without service fields can still be read directly.  
  The core `get` mixin was rewritten to handle both cases transparently.

## Licensing

Alma Design System is designed, architected, and developed by **Mikhail Grebennikov**.  
Select compiler modules were implemented with AI assistance under direct human supervision to accelerate prototyping.  
All conceptual, structural, and visual decisions are authored by Mikhail Grebennikov.  
The resulting codebase is original work authored and owned by Mikhail Grebennikov under the MIT license.

- Code: [MIT](./LICENSE)
- Icons and creative assets: [CC BY-NC 4.0](https://github.com/yamogoo/alma-icons)
- AlmaIcons © 2025 Misha Grebennikov — [https://github.com/yamogoo](https://github.com/yamogoo)

## Author

**Mikhail Grebennikov** — [@yamogoo](https://github.com/yamogoo)
