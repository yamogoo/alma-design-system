![Alma Design System mark](https://github.com/yamogoo/alma-design-system/blob/main/shared/images/logo-with-descriptor.svg)

# Alma Design System Monorepo

Code-first R&D space for UI systems: Vue components, design tokens, adapters, Storybook tooling, and consumer playground apps.

– Live docs: https://alma-design-system.netlify.app

## Results & Impact

- Unified components, tokens, adapters, and tooling into a single monorepo with reproducible installs (`pnpm workspace`).
- Designed and shipped `@alma/tokens-worker`, a custom compiler that turns relational token contracts into consumable JSON/CSS artifacts.
- Introduced the UI Facets map and global namespace exports, simplifying consumption of organisms/templates across apps.
- Delivered a live Storybook deployment (Netlify) with matrices for testing tone × state permutations, enabling async design/dev reviews.
- Established portable lint/test scripts (`pnpm ds:lint`, `pnpm ds:test:unit`) and token build automation (`pnpm prepare`).

## Why This Exists

Alma Design System is a laboratory for testing component architecture, token pipelines, theming strategies, and design-to-code workflows. It is intentionally experimental and subject to breaking changes while ideas are validated.

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

## Apps

`apps/sparkpad` demonstrates integration of the design system through:

- `client`: Vite/Vue consumer UI.
- `server`: lightweight API sandbox.
- `log-server`: auxiliary service for telemetry experiments.

These apps depend on the local packages via pnpm workspaces.

## Getting Started

Prerequisites: Node 20+, pnpm 8+.

```bash
git clone https://github.com/yamogoo/alma-design-system.git
cd alma-design-system

pnpm install:all     # install workspace dependencies
pnpm prepare         # bootstrap generated assets (tokens, types)

pnpm ds:build        # build @alma/design-system
pnpm ds:docs:dev     # start Storybook (http://localhost:6006)
pnpm sparkpad:client:dev  # run Sparkpad client demo (http://localhost:5041)
pnpm sparkpad:server:dev  # run Sparkpad API sandbox
```

> Need more? See `package.json` scripts for additional commands (tests, lint, analytics).

## Key Concepts

- **Tokens-first workflow**: edit JSON contracts in `packages/design-system/src/tokens/src`, then run the worker to regenerate outputs.
- **Adapters vs components**: adapters stay thin and map UI into host app contexts; heavy logic belongs to components/composables.
- **Testing**: Vitest + Vue Test Utils with jsdom, configured via `packages/design-system/vitest.setup.ts`.
- **Storybook**: used for regression demos and token inspection (`pnpm ds:docs:dev`).

## Roadmap Snapshots

- Token path linter and contrast validation for relational contracts.
- Matrix stories covering role × tone × state permutations.
- Continued refinement of tone naming (base ± N system).

## Licensing

- Code: [MIT](./LICENSE)
- Icons and creative assets: CC BY-NC 4.0 (see repository license notes)[https://github.com/yamogoo/alma-icons]
- AlmaIcons © 2025 Misha Grebennikov — https://github.com/yamogoo

## Author

**Mikhail Grebennikov** — [@yamogoo](https://github.com/yamogoo)
