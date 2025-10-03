# 📂 STRUCTURE.md

Updated token structure and rules reflecting the Relational Color Matrix (contracts.rel) and the Base±N tone scale.

## 🔹 Sources Tree

Token entry point: `packages/design-system/src/tokens/src`

```bash
src/tokens/
  src/
    tokens/                     # atomic tokens (spacing, gap, roundness, stroke, touchArea)
      gap.json
      spacing.json
      roundness.json
      outline.json
      stroke.json
      touchArea.json

    typography/                 # typography (tokens + styles)
      tokens.json
      styles/
        body-1.json
        body-2.json
        display-1.json
        ...

    components/                 # component tokens (component semantics)
      atoms/
      molecules/
      templates/

    themes/                     # themes (light / dark / ...)
      light/
        config/
          rel/                  # deltas/rules for state generation (OKLCH)
            border.json
            ...
        contracts/
          rel/                  # Relational matrix: plane/role/tone/state
            surface/*.json
            stroke/*.json
            label/*.json
            onSurface/*.json
            border/*.json
          semantic/             # semantic mappings (if present)
            *.json

      dark/                     # mirrored structure for dark theme
        config/rel/*
        contracts/rel/*

  build/                        # generated artifacts (not committed)
    *.json                      # CSS vars/JSON, reports, logs
```

## 🔹 Relational Matrix (contracts/rel)

The matrix is the single source of truth for colors across:

- Plane: `surface | stroke | onSurface | label | border`
- Role: `neutral | accent | positive | negative | warning`
- Tone (ladder): `base-3 … base+3` (numeric, theme‑agnostic)
- State: `idle | hover | pressed | focus | disabled`

Token path:

- `contracts/rel/<plane>/<role>/<tone>/<state>`

Validation regex for component token values:

- `^contracts/rel/(surface|stroke|onSurface|label|border)/(neutral|accent|positive|negative|warning)/base([+-][1-3])?/(idle|hover|pressed|focus|disabled)$`

Rules:

- Components do not use raw hex; only references to `contracts/rel/*`.
- Role must be consistent within a visual entity for background/border/foreground.
- For `foreground`, WCAG contrast against the associated `surface` is mandatory.

## 🔹 Deltas & State Generation (config/rel)

- States are deterministically derived from the base tone using perceptual OKLCH deltas.
- Example defaults (theme may override):
  - hover: ΔL +0.03 (light) / −0.03 (dark)
  - pressed: ΔL −0.04 (light) / +0.04 (dark)
  - disabled: α −0.50, ΔC −0.20 (with text contrast enforcement)
  - focus: focus ring derived from role’s base `stroke` (+ΔC optional)
- Clamp L/C within safe bounds; when contrast is at risk, auto‑select the nearest `base±k` within the same role.

## 🔹 Tone Scale: Base±N

- Unified numeric ladder: `base, base±1, base±2, base±3`.
- Convention: negative steps increase L (lighter), positive steps decrease L (darker), identical for light and dark themes.
- Legacy mapping (for migration):
  - `lightest → base-3`, `lighter → base-2`, `light → base-1`, `normal → base`, `dark → base+1`, `darker → base+2`, `darkest → base+3`.

## 🔹 Component Tokens → Contracts

Component tokens expose domain semantics but their values reference `contracts/rel/*`.

Example:

- `components/button/accent/primary/background` → `contracts/rel/surface/accent/base-2/idle`
- `components/button/accent/primary/border` → `contracts/rel/stroke/accent/base-2/idle`
- `components/button/accent/primary/label` → `contracts/rel/label/accent/base/idle`

## 🔹 Build & Artifacts

- Generates resolved JSON/vars, coverage reports (generated vs curated), and logs.
- `unresolved-tokens.log` records unresolved references.

## 🔹 Linting & CI (recommended)

- Path validation: each component token must match the `contracts/rel/*` regex.
- Ban raw hex in components.
- WCAG contrast checks for `foreground` vs `background` across all states.
- `meta.origin`: `curated | generated | override` per value.

## 🔹 Authoring Workflow

1. Choose the component role (e.g., Accent.Primary).
2. Map properties to planes per contracts table (background → Surface, border → Stroke, foreground → Label/OnSurface).
3. Pick a tone from Base±N.
4. States are produced automatically from theme deltas.
5. Run contrast checks and review the matrix in Storybook.

## 🔹 Migration Notes

- Replace legacy named tones with `base±N`.
- During the transition, legacy aliases may point to `base±N`.
- Add a token path/contrast linter and wire it into CI.
