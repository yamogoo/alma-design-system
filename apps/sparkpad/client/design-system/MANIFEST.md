# AlmaIconsProtoKit — MANIFEST

**AlmaIconsProtoKit** is a prototype UI Kit and design system infrastructure that unifies **components**, **tokens**, **fonts**, **icons**, and **utilities** into a single platform for product development.

This document provides a **project structure overview**, **module descriptions**, and **usage examples**.

📂 Project Structure

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

### 📖 Summary

AlmaIconsProtoKit is not just a component library, but an **experimental design system platform** that brings together:

- 🖼️ Assets (fonts, icons, animations)

- 🎨 Tokens (colors, typography, spacing, themes)

- 🧩 Components & Adapters (atomic design + environment bindings)

- ⚡ Composables & Utils (hooks and helpers)

- 📚 Documentation (Storybook, MANIFEST, Figma integration)
