![image](https://github.com/yamogoo/alma-design-system/blob/main/shared/images/logo-with-descriptor.svg)

# Alma Design System

R&D playground for UI systems: components, tokens, theming, and tooling.

— Live docs: https://alma-design-system.netlify.app

### About

Alma Design System is an experimental, code-first platform for researching design-system architecture. It is not a production-ready UI kit, but a focused lab for ideas that can later evolve into stable packages.

Key goals:

- Explore trade-offs between performance, DX, and design flexibility.
- Test token pipelines, theming strategies, component contracts.
- Prototype iconography and type workflows.
- Bridge design tools and developer platforms.

## ✨ What’s New (Core Features)

- Relational color matrix (contracts.rel): single source of truth for colors across planes/roles/tones/states. See: `src/tokens/contracts.rel.md`.
- Deterministic state generation: normal/hover/pressed/focus/disabled derived via perceptual OKLCH deltas per theme.
- Base±N tone scale: numeric, theme-agnostic tone ladder (`base-3 … base+3`) replacing ambiguous “light/dark” names.
- Contracts and lintable paths: component tokens must resolve to `contracts/rel/<mode>/<tone>/<state>`; no raw hex in components.
- Tokens worker pipeline (developed using AI): code-first tokens, resolvers, converters, build outputs (JSON, SCSS maps, CSS).
- Storybook: custom theme + live visualization of varinat x size x mode × tone × state.

## 🎯 Status

Experimental & evolving — expect breaking changes. Adapters are deliberately thin.

## 🛠 Stack & Tech

- Vue 3 + TypeScript, Vite
- Custom SCSS core (mixins, abstracts)
- OKLCH color math for deltas
- Design tokens & themes (code-first)
- Storybook
- GSAP for motion
- tokens-worker (developed using AI)
- [Alma Icons](https://almaicons.netlify.app/icons)
- [Vue3ResizeBounding](https://resize-bounding.netlify.app/) for resizable UI
- Structure docs: [MANIFEST.md](./MANIFEST.md), [MANIFEST.yaml](./MANIFEST.yaml)

**Modular Tokens System**

- Sources → `src/tokens/src`
- Contracts (relational) → `src/tokens/src/themes/<id>/contracts/rel/*`
- Config/deltas → `src/tokens/src/themes/<id>/config/rel/*`
- Build output → generated during package build
- Architecture → `src/tokens/structure.md`

**🔗 Figma Integration**

- Forward (Code → Figma): supported and recommended.

## 💻 Quick Start

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

> ℹ️ **Startup**: first dev launch may take ~10-20s due to asset pre-processing and pre-bundling.  
> **HMR is instantaneous** afterwards, so iteration speed remains high.

Open Storybook at http://localhost:6006 or the app at http://localhost:5041.

## 🧭 Roadmap (abridged)

- Token path linter + contrast CI for contracts/rel

## License

MIT for code. Icons and creative assets are licensed under CC BY-NC (Creative Commons Attribution–NonCommercial).

[MIT](https://github.com/yamogoo/alma-design-system/blob/main/LICENSE)

## Author

**Mikhail Grebennikov** - [yamogoo](https://github.com/yamogoo)
