# 📂 STRUCTURE.md

## 🔹 Build (собранные артефакты)

```bash
/build
  ├── baseColors.json        # base input colors
  ├── colors.json            # generated color palette (auto-generated)
  ├── breakpoints.json       # responsive breakpoints
  ├── tokens.json            # base tokens (spacing, radii, …)
  ├── typography.json        # compiled typography tokens and styles
  ├── components.json        # component-level tokens (spacing, sizes, …)
  ├── themes.json            # compiled themes (light, dark …)
  ├── config.json            # global build configuration
  └── unresolved-tokens.log  # log of unresolved references
```

## 🔹 Source (raw tokens and themes)

```bash
src
  ├── baseColors.json          # source of truth for base colors
  ├── colors.json              # generated colors (auto-generated)
  ├── breakpoints.json         # base breakpoints
  ├── tokens/                  # atomic tokens (spacing, gap, roundness…)
  │    ├── gap.json
  │    ├── spacing.json
  │    ├── roundness.json
  │    ├── outline.json
  │    ├── stroke.json
  │    └── touchArea.json
  ├── typography/              # typography tokens
  │    └── typography/
  │         ├── tokens.json
  │         └── styles/
  │              ├── body-1.json
  │              ├── body-2.json
  │              ├── display-1.json
  │              └── ...
  ├── components/              # baseline components (geometry, layout)
  │    ├── atoms/
  │    │    ├── button.json
  │    │    ├── icon.json
  │    │    └── ...
  │    ├── molecules/
  │    │    ├── form.json
  │    │    ├── dropdown.json
  │    │    └── ...
  │    └── templates/
  │         ├── mainHeader.json
  │         └── mainFooter.json
  ├── themes/                  # semantic theme layer
  │    └── themes/
  │         ├── dark/
  │         │    ├── abstracts/     # abstract layers (border, surface, shadow…)
  │         │    ├── atoms/         # atoms with color variants
  │         │    │    ├── button/
  │         │    │    │    ├── accent.json
  │         │    │    │    ├── neutral.json
  │         │    │    │    ├── positive.json
  │         │    │    │    └── negative.json
  │         │    │    └── ...
  │         │    ├── molecules/
  │         │    └── templates/
  │         └── light/         # same structure as dark
  └── config/                  # build configuration
       └── config.json
```

## 🔹 Layering logic

- `tokens/` → atomic base values (spacing, radii, stroke, etc.).

- `typography/` → typography tokens (raw tokens + ready-to-use styles).

- `components/` → baseline components (geometry, sizing, layout).

- `themes/` → semantic themes (mode, tone, abstract layers, color variants).

- `baseColors.json` → base color definitions (source of truth).

- `colors.json` → generated palette (auto-generated from baseColors).

- `build/` → final compiled JSON artifacts (for app/runtime consumption).
