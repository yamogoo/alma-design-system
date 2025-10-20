![Alma Design System mark](https://github.com/yamogoo/alma-design-system/blob/main/shared/images/logo-with-descriptor.svg)

# @alma/design-system

Experimental Vue 3 design-system package that powers Alma’s R&D playground. It bundles atomic components, adapters, composables, tokens, styling, and Storybook infrastructure in a single workspace-aware package.

– Live docs & Storybook: https://alma-design-system.netlify.app

## Highlights

- Vue 3 + TypeScript component library structured by atomic design.
- Code-first token source compiled into JSON bundles by `@alma/tokens-worker`.
- SCSS core with runtime entry `app.runtime.scss` and Storybook bundle `_index.scss`.
- Pinia stores, composables, and utilities for host app integration experiments.
- Storybook stories, decorators, and Vitest setup for rapid prototyping.

## Install

### Workspace (recommended)

The package is published through the monorepo. Inside this repository run:

```bash
pnpm install:all
pnpm prepare
```

Consumers inside the workspace can reference the package directly:

```ts
import { Components } from "@alma/design-system";
import "@alma/design-system/app.runtime.scss";
```

### External Project (experimental)

```bash
pnpm add @alma/design-system
```

> External consumption is experimental; expect breaking changes between releases.

## Usage Snippets

```vue
<script setup lang="ts">
import { Components, Stores, Tokens } from "@alma/design-system";

const { Button } = Components.atoms;
const connection = Stores.useConnectionStore();
</script>

<template>
  <Button @click="connection.setIsConnected(true)">
    {{ Tokens.components.button.primary.label }}
  </Button>
</template>
```

Add runtime styles once per app:

```scss
@use "@alma/design-system/app.runtime.scss" as *;
```

## Directory Overview

See [MANIFEST.md](./MANIFEST.md) and [MANIFEST.yaml](./MANIFEST.yaml) for the complete breakdown. Key folders under `src/`:

- `components/` — Vue SFCs grouped as atoms, molecules, organisms, templates.
- `adapters/` — thin wrappers that bridge components into host environments.
- `composables/` — global and local composition utilities.
- `tokens/` — token source (`src/`), resolved cache (`.cache/`), and generated outputs (`output/`).
- `assets/` — fonts, icons, animations, SCSS core.
- `stories/` — Storybook stories, decorators, utilities.
- `stores/` — Pinia stores such as `useConnectionStore`.
- `utils/` — shared helpers (events, sanitize, gsap guards).
- `__tests__/` — Vitest fixtures and DOM mocks.

## Tokens Workflow

1. Edit JSON contracts under `src/tokens/src`.
2. Rebuild the cache with `pnpm ds:tokens:cache` (or clean via `pnpm ds:tokens:clean`).
3. `.cache/` mirrors the authored structure with fully resolved values; aggregated bundles land in `src/tokens/output` and are exported through `src/tokens/index.ts`.
4. Dev imports like `@/tokens/src/**/*.json` now point to `.cache/**` so CSS-in-JS code consumes resolved data during development.

Verify that `.cache` content matches the build output at any time via:

```bash
pnpm ds:tokens:verify
```

`@alma/tokens-worker` lives at `packages/tokens-worker` and can be used standalone for custom pipelines.

## Scripts

```bash
pnpm build        # vite library build (outputs to dist/)
pnpm docs:dev     # Storybook @ http://localhost:6006
pnpm docs:build   # Storybook static build
pnpm test:unit    # Vitest suite
pnpm lint         # ESLint over src/**
pnpm typecheck    # vue-tsc verification
pnpm tokens:cache        # rebuild .cache and derived outputs
pnpm tokens:cache:clean  # remove .cache/ and output/
pnpm tokens:cache:verify # compare build artifacts against .cache
```

Additional scripts can be found in [package.json](./package.json).

## Development Notes

- Peer deps: `vue`, `vue-router`, and `pinia` — keep versions aligned in host apps.
- Components are published via `dist/`; ensure new exports are wired through `src/index.ts`.
- Keep adapters thin and prefer colocated tests (`*.spec.ts`) alongside implementations.
- Temporary experiments belong in `**/*.temp/` (git-ignored).

## License

MIT — see [../../LICENSE](../../LICENSE) for details. Icons and creative assets follow the repository’s CC BY-NC 4.0 notice.
