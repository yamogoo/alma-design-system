# AlmaProtoKit

### R&D Playground for UI & System Design

### About the Project

AlmaProtoKit is my personal **R&D and exploratory project** — an experimental design system platform (see [MANIFEST.md](./packages/design-system/MANIFEST.md) and [MANIFEST.yaml](./packages/design-system/MANIFEST.yaml)).  
Its main goal is to **experiment with design system concepts**, study different approaches, and strengthen my engineering skills.

This is **not a polished production-ready library**, but rather a **sandbox for growth and research**, where I:

- Explore trade-offs between performance, developer experience, and design flexibility;
- Test token pipelines, theming strategies, component architectures, and cross-framework integration;
- Experiment with iconography, type design (font making), and other aspects of UI systems;
- Gain insights that will inform the creation of a more mature and efficient system in the future (such as Alma-UI, Alma-Tokens, Alma-Icons, or other parts of the Alma ecosystem).

Think of AlmaProtoKit as a **design-system R&D playground** — a foundation for the next generation of design system work rather than a production framework.

[Design System (Storybook)](https://alma-proto-kit.netlify.app)

## 🚀 Goals

- Experiment with **design tokens pipelines** (JSON → SCSS → CSS variables).
- Prototype **multi-weight icon systems**.
- Explore **runtime** vs **compile-time theming strategies**.
- Validate **component patterns** for Vue 3 and React.
- Research **bridges between design tools (Figma) and developer platforms**.

> Everything is optimized for my stack and workflow, without the bloat of prebuilt UI libraries.

## 🎯 Status

🚧 Experimental & evolving — expect breaking changes.
Components may ship with adapters, which are deliberately **thin wrappers** only.

## 🛠 Stack & Tech

- **Vue 3 + TypeScript**
- **Custom SCSS core** with mixins and utilities
- **GSAP** for motion and animation
- **Adapters** for environment-specific bindings
- **Design tokens & themes** (code-first)
- **Custom components and composables**
- [Alma Icons](https://almaicons.netlify.app/icons)
- [Vue3ResizeBounding](https://resize-bounding.netlify.app/) for resizable UI
- Project structure and module definitions specified in [MANIFEST.md](./packages/design-system/MANIFEST.md) and [MANIFEST.yaml](./packages/design-system/MANIFEST.yaml)

**Modular Design Tokens System**

> AlmaProtoKit includes a **structured token system** with support for JSON, YAML, and TypeScript.

- **Source tokens** → `tokens/src`
- **Build output** → `tokens/build`
- **Architecture docs** → `tokens/structure.md`

**🔗 Figma Integration**

AlmaProtoKit provides **end-to-end integration** with **Figma**:

- ✅ **Forward flow (Code → Figma)**: fully supported and recommended.
- ♻️ **Backward flow (Figma → Code)**: possible for compatibility, but discouraged.

The system is **code-driven**: tokens in code are the single source of truth. This ensures designers and developers share the same foundation without workflow fragmentation.

## 💻 Demo

```bash
# Clone repository
git clone https://github.com/yamogoo/alma-ptoto-kit.git

# Go to project folder
cd alma-proto-kit

# Install dependencies
pnpm install

# Run development server (Vue app)
pnpm sparkpad:client:dev

# Run Storybook for component demos
pnpm ds:docs:dev
```

> For details on project structure and module definitions, see [MANIFEST.md](./packages/design-system/MANIFEST.md) and [MANIFEST.yaml](./packages/design-system/MANIFEST.yaml).

> ℹ️ **Startup**: first dev launch may take ~3-7s due to asset pre-processing and pre-bundling.  
> **HMR is instantaneous** afterwards, so iteration speed remains high.

_Then open http://localhost:3000 to see AlmaProtoKit in action._

## License

MIT for code. Icons and creative assets may be licensed separately.

[MIT](https://github.com/yamogoo/alma-ui/blob/main/LICENSE)

## Author

**Mikhail Grebennikov** - [yamogoo](https://github.com/yamogoo)
