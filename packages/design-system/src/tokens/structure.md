# 📂 STRUCTURE.md

## 🔹 Build (compiled artifacts)

```bash
/build
  ├── baseColors.json        # base input colors (source of truth)
  ├── colors.json            # expanded color palette (auto-generated)
  ├── breakpoints.json       # responsive breakpoints
  ├── tokens.json            # core tokens (spacing, radii, stroke, …)
  ├── typography.json        # compiled typography tokens and styles
  ├── components.json        # component-level tokens (atoms, molecules, templates)
  ├── themes.json            # compiled semantic themes (light, dark …)
  ├── config.json            # global build configuration
  └── unresolved-tokens.log  # log of unresolved references

  ## 🔹 Source (raw tokens and themes)

  /src
  ├── baseColors.json          # raw base colors (system palette source)
  ├── colors.json              # expanded colors (auto-generated from baseColors)
  ├── breakpoints.json         # base responsive breakpoints
  ├── tokens/                  # atomic tokens (spacing, gap, roundness…)
  │    ├── gap.json
  │    ├── spacing.json
  │    ├── roundness.json
  │    ├── outline.json
  │    ├── stroke.json
  │    └── touchArea.json
  ├── typography/              # typography tokens
  │    ├── tokens.json
  │    └── styles/
  │         ├── body-1.json
  │         ├── body-2.json
  │         ├── display-1.json
  │         ├── title-1.json
  │         └── ...
  ├── components/              # baseline components (geometry, sizing, layout)
  │    ├── atoms/
  │    │    ├── button.json
  │    │    ├── icon.json
  │    │    ├── input.json
  │    │    └── ...
  │    ├── molecules/
  │    │    ├── form.json
  │    │    ├── dropdown.json
  │    │    └── ...
  │    └── templates/
  │         ├── mainHeader.json
  │         ├── mainFooter.json
  │         └── navigationRail.json
  ├── themes/                  # themed semantic layer (light, dark…)
  │    ├── dark/
  │    │    ├── abstracts/     # abstract layers (surface, label, border, stroke…)
  │    │    ├── semantics/     # semantic tokens (contracts: button, input, etc.)
  │    │    ├── components/    # themed component tokens
  │    │    └── config/        # theme-level config
  │    └── light/              # same structure as dark
  └── config/
       └── config.json         # global build configuration

## 🔹 Cache (build cache)

/.cache
  ├── resolved/        # resolved token trees after preprocessing
  ├── transforms/      # cached transformation results
  └── diagnostics.log  # build diagnostics and debug info

> Used internally to speed up token compilation and prevent redundant processing. Can be safely deleted; it will be re-generated on the next build.

## 🔹 Figma (imported raw tokens)

/.figma
  ├── raw/             # raw JSON exports from Figma Tokens plugin
  ├── mapped/          # mapped tokens adapted to DS structure
  └── report.log       # import logs (conflicts, warnings)

> Source files imported directly from Figma (via Tokens Studio or similar). They are normalized into the /src structure before being built.

🔹 Layering Logic

- baseColors.json → base system colors (the source of truth).
- colors.json → expanded derivative palette (auto-generated from baseColors).
- tokens/ → atomic tokens (spacing, gap, radii, outline, stroke, touch area).
- typography/ → raw typography tokens + ready-to-use text styles.
- components/ → baseline component tokens (geometry, sizing, layout).
- themes/ →
  - abstracts = fundamental roles (Surface, Label, Stroke, Border, Shadow, Highlight, Selection).
  - semantics = semantic tokens (contracts; combinations of abstracts for states and tones).
  - components = themed component tokens (atoms, molecules, templates).
  - config = theme-level configuration.
- build/ → compiled artifacts, consumed by apps and runtime.
```
