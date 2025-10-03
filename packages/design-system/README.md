![image](https://github.com/yamogoo/alma-design-system/blob/main/shared/images/logo-with-descriptor.svg)

# Alma Design System

R&D playground for UI systems: components, tokens, theming, and tooling.

— Live docs: https://alma-proto-kit.netlify.app

> Prototype environment to explore UI architecture, tokens, iconography, type workflows, and cross-framework integration. See [MANIFEST.md](./MANIFEST.md) and [MANIFEST.yaml](./MANIFEST.yaml).

## ✨ What’s New (Core Features)

- Relational color matrix (contracts.rel): single source of truth for planes/roles/tones/states. See: `src/tokens/contracts.rel.md`.
- Deterministic states via OKLCH deltas: hover/pressed/focus/disabled generated from base tones per theme.
- Base±N tone scale: numeric tone ladder (`base-3 … base+3`) for both light and dark themes.
- Contracts and lintable paths: component tokens must resolve to `contracts/rel/<plane>/<role>/<tone>/<state>`; no raw hex in component tokens.
- Storybook branding theme + token stories: visualize role × tone × state and verify contrast.
- Tokens worker: resolvers/converters and build outputs.

## 🎯 Status

Experimental & evolving — expect breaking changes. Adapters remain thin wrappers.

## 🛠 Stack & Tech

- Vue 3 + TypeScript, Vite
- SCSS core (mixins, abstracts)
- OKLCH color math for deltas
- Storybook (docs, a11y, interactions)
- GSAP for motion
- tokens-worker (build/link pipeline)
- Alma Icons; Vue3ResizeBounding
- Structure docs: [MANIFEST.md](./MANIFEST.md), [MANIFEST.yaml](./MANIFEST.yaml)

**Modular Tokens System**

- Sources → `src/tokens/src`
- Contracts (relational) → `src/tokens/src/themes/<id>/contracts/rel/*`
- Config/deltas → `src/tokens/src/themes/<id>/config/rel/*`
- Build output → generated during package build
- Architecture → `src/tokens/structure.md`

**🔗 Figma Integration**

- Forward (Code → Figma): supported and recommended.
- Backward (Figma → Code): compatible but discouraged — code is the source of truth.

## 💻 Demo

```bash
git clone https://github.com/yamogoo/alma-proto-kit.git

# Go to project folder
cd alma-proto-kit

# Install dependencies
pnpm install:all

# Prepare and build packages
pnpm prepare

pnpm ds:build            # build @alma/design-system
pnpm ds:docs:dev         # run Storybook
pnpm sparkpad:client:dev # run demo app (client)
pnpm sparkpad:server:dev # run demo app (server)
```

> For details on project structure and module definitions, see [MANIFEST.md](./MANIFEST.md) and [MANIFEST.yaml](./MANIFEST.yaml).

> ℹ️ **Startup**: first dev launch may take ~3-7s due to asset pre-processing and pre-bundling.  
> **HMR is instantaneous** afterwards, so iteration speed remains high.

Open Storybook at http://localhost:6006 or the app at http://localhost:3000.

## License

MIT for code. Icons and creative assets are licensed under CC BY-NC (Creative Commons Attribution–NonCommercial).

[MIT](https://github.com/yamogoo/alma-proto-kit/blob/main/LICENSE)

## Author

**Mikhail Grebennikov** - [yamogoo](https://github.com/yamogoo)
