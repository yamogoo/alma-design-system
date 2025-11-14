![Alma Design System mark](https://github.com/yamogoo/alma-design-system/blob/main/shared/images/logo-with-descriptor.svg)

# @alma/design-system

**Experimental Vue 3 design-system package for R&D and skill demonstration.**  
This package powers the Alma playground and showcases modern frontend engineering practices — typed Vue components, token pipelines, modular SCSS, adapters, and Storybook integration — all bundled in a single workspace-aware package.

– Live docs & Storybook: [alma-design-system.netlify.app](https://alma-design-system.netlify.app)

---

## Highlights

- Vue 3 + TypeScript component library based on atomic design.
- Code-first token source compiled into JSON bundles by `@alma/tokens-worker`.
- SCSS core with runtime entry `app.runtime.scss` and Storybook bundle `_index.scss`.
- Pinia stores, composables, and utilities for integration experiments.
- Storybook stories, decorators, and Vitest setup for rapid prototyping.

---

## Installation

### Workspace (recommended)

The package is part of the Alma monorepo. Inside the repository run:

```bash
pnpm install:all
pnpm prepare
```

Consumers in the workspace can import directly:

```ts
import { Components } from "@alma/design-system";
import "@alma/design-system/app.runtime.scss";
```

### External Project (experimental)

```bash
pnpm add @alma/design-system
```

> External consumption is experimental; breaking changes may occur between releases.

---

## Usage Example

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

---

## Directory Overview

See [MANIFEST.md](./MANIFEST.md) and [MANIFEST.yaml](./MANIFEST.yaml) for detailed architecture.  
Key folders under `src/`:

- `components/` — Vue SFCs grouped by atomic layers.
- `adapters/` — thin wrappers bridging components to host apps.
- `composables/` — reusable composition utilities.
- `tokens/` — token source (`src/`), resolved cache (`.cache/`), generated outputs (`output/`).
- `assets/` — fonts, icons, animations, SCSS core.
- `stories/` — Storybook stories and decorators.
- `stores/` — Pinia stores (e.g. `useConnectionStore`).
- `utils/` — shared helpers and guards.
- `__tests__/` — Vitest fixtures and mocks.

---

## Tokens Workflow

1. Edit JSON token contracts under `src/tokens/src`.
2. Rebuild cache with `pnpm ds:tokens:cache` (clean via `pnpm ds:tokens:clean`).
3. `.cache/` mirrors the authored structure with resolved values; aggregated bundles land in `src/tokens/output` and export through `src/tokens/index.ts`.
4. Dev imports like `@/tokens/src/**/*.json` resolve to `.cache/**` for live token use.

Verify `.cache` consistency anytime:

```bash
pnpm ds:tokens:verify
```

The compiler (`@alma/tokens-worker`) lives in `packages/tokens-worker` and can be used independently.

---

## Scripts

```bash
pnpm build                # Vite library build (dist/)
pnpm docs:dev             # Storybook → http://localhost:6006
pnpm docs:build           # Storybook static build
pnpm test:unit            # Vitest tests
pnpm lint                 # ESLint
pnpm typecheck            # vue-tsc type verification
pnpm tokens:cache         # rebuild .cache and outputs
pnpm tokens:cache:clean   # remove .cache/ and outputs
pnpm tokens:cache:verify  # compare build artifacts
```

See [package.json](./package.json) for additional scripts.

---

## Development Notes

- Peer deps: `vue`, `vue-router`, and `pinia` — align versions in host apps.
- Components publish from `dist/`; export new modules via `src/index.ts`.
- Keep adapters lightweight and colocate tests (`*.spec.ts`) with implementations.
- Temporary experiments belong in `**/*.temp/` (git-ignored).

---

## License

MIT — see [../../LICENSE](../../LICENSE) for details.  
Icons and creative assets follow [CC BY-NC 4.0](https://github.com/yamogoo/alma-icons).
