# AlmaProtoKit

### R&D Playground for UI & System Design

> AlmaProtoKit is my personal R&D project — an experimental design system platform (see [MANIFEST.md](./apps/sparkpad/client/design-system/MANIFEST.md) and [MANIFEST.yaml](./apps/sparkpad/client/design-system/MANIFEST.yaml)) where I explore new approaches to UI development, design tokens, iconography, and cross-framework integration.

This is not a production-ready library, but rather a prototype environment where I test ideas that may later evolve into Alma-UI, Alma-Tokens, Alma-Icons, or other parts of the Alma ecosystem.

Think of AlmaProtoKit as a design-system R&D playground rather than a production framework.

## 🚀 Goals of AlmaProtoKit

- Experiment with design tokens pipelines (JSON → SCSS → CSS variables).
- Prototype multi-weight icon systems.
- Explore runtime vs compile-time theming strategies.
- Validate component patterns for Vue 3 and React.
- Research how to bridge design tools (Figma) with developer platforms.

> Everything is optimized for my stack and workflow, without the bloat of prebuilt UI libraries.

## 🎯 Status

🚧 Experimental & evolving. Expect breaking changes.  
Components may have corresponding adapters; adapters are thin wrappers only.

Fonts are included for offline-first usage and can be later replaced with CDN-hosted versions if desired.

## 🛠 Stack & Tech

- Vue 3 + TypeScript
- Adapters for environment-specific component bindings
- GSAP for animations
- Custom design tokens & themes
- SCSS core with mixins and utilities
- Fully custom components and composables
- [Alma Icons](https://almaicons.netlify.app/icons)
- [Vue3ResizeBounding](https://resize-bounding.netlify.app/) for resizable UI
- Project structure and module definitions specified in [MANIFEST.md](./apps/sparkpad/client/design-system/MANIFEST.md) and [MANIFEST.yaml](./apps/sparkpad/client/design-system/MANIFEST.yaml)

**Modular Design Tokens System**

> AlmaProtoKit includes a structured token system with support for JSON, YAML, and TypeScript. Tokens are organized under `tokens/src` (source), `tokens/build` (runtime output), and `tokens/structure.md`.

## 💻 Demo

> For details on project structure and module definitions, see [MANIFEST.md](./apps/sparkpad/client/design-system/MANIFEST.md) and [MANIFEST.yaml](./apps/sparkpad/client/design-system/MANIFEST.yaml).

```bash
# Clone repository
git clone https://github.com/yamogoo/alma-ui.git

# Go to project folder
cd alma-proto-kit

# Install dependencies
pnpm install

# Run development server (Vue app)
pnpm client:dev

# Run Storybook for component demos
pnpm storybook:dev
```

_Then open http://localhost:3000 to see AlmaProtoKit in action._

## License

MIT for code. Icons and creative assets may be licensed separately.

[MIT](https://github.com/yamogoo/alma-ui/blob/main/LICENSE)

## Author

**Mikhail Grebennikov** - [yamogoo](https://github.com/yamogoo)
