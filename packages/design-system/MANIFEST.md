# AlmaIconsProtoKit — MANIFEST

**AlmaIconsProtoKit** is a prototype UI Kit and design system infrastructure that unifies **components**, **tokens**, **fonts**, **icons**, and **utilities** into a single platform for product development.

This document provides a **project structure overview**, **module descriptions**, and **usage examples**.

## 🗂 Monorepo Overview

```bash
apps/
  sparkpad/
    client/        # consumer (frontend)
    server/        # consumer (backend API)
    log-server/    # consumer (logging service)

packages/
  design-system/   # @alma/design-system — components, adapters, SCSS core, Storybook utils
  tokens/          # @alma/tokens        — source and compiled design tokens
  tokens-worker/   # @alma/tokens-worker — token build/link pipeline and converters
```

> The SCSS core is kept inside `packages/design-system` and is not extracted into a separate package.
> Global styles entry point:

```scss
@use "@alma/design-system/core.scss" as *;
```

## 📂 Project Structure

```bash
adapters/       — environment-specific wrappers for components
assets/         — base resources (fonts, icons, animations, SCSS core)
components/     — Vue components (atoms, molecules, organisms, templates)
composables/    — Vue composables (global and local hooks)
constants/      — UI constants
declarations/   — TypeScript declarations
directives/     — Vue directives
scripts/        — build/dev helper scripts
stories/        — Storybook stories (components and tokens)
tokens/         — design tokens (JSON), theming (light/dark), build outputs
typings/        — TypeScript types for UI, API, router, etc.
utils/          — helper utilities (units, events, sanitization, etc.)
MANIFEST.yaml   — machine-readable specification
MANIFEST.md     — human-readable documentation (this file)
```

## 📦 Modules Overview

### 🔹 Adapters

Adapters provide `bridges` between raw Vue components and specific environments/contexts.
They contain minimal wrappers and mapping logic, while components/ keep the full UI and typing contracts.

- **atoms/** — wrappers for atomic components (`button`, `input`, `icon`, etc.)

- **molecules/** — wrappers for combined elements (`forms`, `dropdowns`, `snackbar`)

- **organisms/** — environment-specific complex blocks

- t**emplates/** — high-level layout wrappers

### 🔹 Assets

- **animations/** — JSON animations (e.g., `spinner`, `themeIcon`)

- **fonts/** — bundled fonts for offline-first usage (Manrope Cyrillic + Latin, weights 200–800)

- **icons/** — AlmaIcons entry point (`index.ts`)

- **images/** — static images

- **scss/** — style core:
  - abstracts/ — tokens, base colors, breakpoints, themes

  - core/ — functions & mixins (px2rem, themify, map-get)

  - extends/ — extensions (animations, containers, components)

  - mixins/ — reusable SCSS mixins

  - app.\*.scss — global entry points

### @alma/tokens (packages/tokens)

The single source of truth for design tokens.

**Structure**

```bash

src/
  abstracts/     # backgrounds, borders, shadows, base colors
  tokens/        # spacing, stroke, roundness, gaps, touch areas
  typography/    # type styles and scale
  themes/        # light/dark
  components/
    atoms/ molecules/ templates/
build/           # compiled runtime tokens (JSON, CSS vars, …) — generated
structure.md     # token architecture docs

```

#### Figma Integration:

- Full Code → Figma export supported

- Backward Figma → Code compatibility exists, but discouraged (system is code-first)

- Tokens remain the single source of truth in code

### @alma/tokens-worker (packages/tokens-worker)

Token build utilities: resolving nested references, generating artifacts (JSON, CSS vars), converters, Figma-format integration.

### 🔹 Components

Atomic design structure with Vue 3 + TypeScript.
Each component has:

- Implementation (`.vue + .ts`)

- Typings (e.g., `Button.ts` contains `ButtonProps`)

- Unit tests (`.spec.ts`)

- Stories (`.stories.ts[x]`)

- atoms/ — smallest units (`buttons`, `icons`, `inputs`, `typography`)

- molecules/ — composed elements (`dropdown`, `forms`, `snackbar`)

- organisms/ — complex blocks (`editor`, `navigation`, `forms`)

- templates/ — ready-to-use layouts (`headers`, `footers`, `menus`)

### 🔹 Composables

- **global/** — app-wide hooks (`theme`, `meta`, `connection` state)

- **local/** — feature/local hooks (`hover`, `clickOutside`, `drag-and-drop`, `SEO`, `navigation`, etc.)

### 🔹 Tokens

- **src/** — source JSON tokens:

- **abstracts**/ — backgrounds, borders, shadows, base colors

- **atoms/**, **molecules/**, **templates/** — per-component tokens

- **themes/** — light and dark variants

- **typography/** — text styles and type scale

- **tokens/** — spacing, stroke, roundness, gaps, touch areas

- **build/** — compiled runtime tokens (CSS vars, JSON) — not committed, generated during build

- **structure.md** — token architecture docs

### 🔹 Stories

- **components/** — story examples for atomic/molecular UI

- **decorators/** — Storybook global wrappers

- **tokens/** — theme and token showcase

- **utils/** — helpers for story organization

### 🔹 Utils

- Unit conversion (`px2rem`)

- Path parsing (`getPathSegment`)

- Event helpers

- Unit testing helpers (Vitest setup)

### 🔹 Typings

- API, routing, themes, localization, UI controls, elements

- Declaration helpers (`.d.ts`)

### ✅ Rules & Conventions

- `**/*.temp/` — draft components/composables (ignored via `.gitignore`, not part of repo)

- `tokens/build/` — generated only, excluded from git

- Fonts included for **offline-first**; can be later replaced with CDN-hosted package

- Each component must include at least: `.vue + .ts + .spec.ts`; stories optional but recommended

- Adapters must remain **thin wrappers**; heavy UI logic belongs in components

### 🧪 Testing

- Vitest + Vue Test Utils.

- DOM types (jsdom) enabled for `design-system` tests.

### 📖 Summary

AlmaIconsProtoKit is now organized as a **monorepo** with clear separation between **packages** and **consumer apps**:

- 🎨 @alma/tokens — tokens (code-first source of truth)

- 🧩 @alma/design-system — Vue components + SCSS core

- ⚙️ @alma/tokens-worker — token build pipeline

- 🧪 Consumer apps (client, server, log-server) — use the packages

This structure enables modular delivery, faster builds, easier versioning, and better reuse across projects.
