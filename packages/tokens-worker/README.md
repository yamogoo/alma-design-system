# @alma/tokens-worker

Lightweight token build/parsing toolkit used to assemble JSON design tokens into SCSS maps and CSS variables, resolve nested references, evaluate color expressions, and generate theme bundles.

## AI Assistance Disclosure

This package (parsers and supporting build utilities) was implemented with the assistance of AI tools (ChatGPT). The overall architecture, requirements, and interfaces were defined by a human author; AI was used to draft and iterate on the implementation. The resulting code was reviewed and adapted for this project.

If you contribute changes, please keep this disclosure and note in your commit messages when AI assistance is used.

## Scripts

- `pnpm build` — compile TypeScript to `dist/`
- `pnpm lint` — run ESLint

## Notes

- The parser supports nested token references, file-structure lookup, color expressions (e.g., `rgba()`, `lighten()`, `darken()`), and optional CSS variable emission with conflict resolution.
- Verbose logging can be enabled with `verbose: true` to surface diagnostics during token resolution.

# TokensParser

## Usage

### Color functions cheat-sheet (TokensParser)

All comments are in English so you can drop this into your repo’s docs.

#### Literals & references

| Kind                     | Syntax                                                                                                           | Description                                                                  | Example                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| Color literal            | `#RRGGBB`, `#RRGGBBAA`, `rgb(...)`, `rgba(...)`, `hsl(...)`, `hsla(...)`, `lab(...)`, `oklab(...)`, `oklch(...)` | Direct color values recognized by the parser.                                | `"#6699ff"`, `rgb(102 153 255)`, `oklch(0.78 0.08 250)` |
| Token reference          | `{file.path.to.token}`                                                                                           | Inlines the referenced token’s `value` (recursively resolved).               | `{themes.light.abstracts.label.neutral.primary.base}`   |
| Embedded refs in strings | `func({ref}, 0.5)`                                                                                               | Refs can appear inside function args and will be resolved before evaluation. | `mix_oklch({accent.primary}, {neutral.surface}, 0.35)`  |

> **Output formatting**
> The final string format is controlled by the token’s unit (e.g. hex, rgba, hsl, lab, oklab, oklch). If not set, hex is used by default.

#### Core (sRGB/HSL/Lab) expression functions

> These return an sRGB color internally and then are formatted per unit.

| Function     | Signature                   | What it does                                            | Notes                                                              | Example (→ representative output)                |
| ------------ | --------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `rgba`       | `rgba(color, alpha)`        | Sets alpha while keeping the base color channels.       | `alpha` accepts `0..1` or `%`.                                     | `rgba(#6699ff, .5)` → `rgba(102, 153, 255, 0.5)` |
| `lighten`    | `lighten(color, amount)`    | Lightens the color in library’s default HSL-like space. | Perceptual accuracy is better with OKLCH; see `rel_lighten_oklch`. | `lighten(#6699ff, .1)`                           |
| `darken`     | `darken(color, amount)`     | Darkens the color in HSL-like space.                    | Prefer `rel_darken_oklch` for tone-accurate shifts.                | `darken(#6699ff, .06)`                           |
| `saturate`   | `saturate(color, amount)`   | Increases saturation.                                   | HSL-like saturation.                                               | `saturate(#6699ff, .15)`                         |
| `desaturate` | `desaturate(color, amount)` | Decreases saturation.                                   | HSL-like saturation.                                               | `desaturate(#6699ff, .2)`                        |

#### Perceptual (OKLab/OKLCH) expression functions

> These operate in OKLab/OKLCH for more uniform, tone-preserving results.

| Function            | Signature                             | What it does                                                                                            | Notes                                                                | Example (→ representative output)               |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| `oklch`             | `oklch(L C H)` or `oklch(L C H / A)`  | Constructs a color from OKLCH components.                                                               | `L∈[0..1]`, `C≥0`, `H` in degrees; optional `A∈[0..1]`.              | `oklch(0.78 0.08 250)`                          |
| `oklab`             | `oklab(L A B)` or `oklab(L A B / A)`  | Constructs a color from OKLab components.                                                               | `L∈[0..1]`. `A`, `B` around `[-0.5..0.5]` typical; optional `A`lpha. | `oklab(0.75 0.04 -0.06)`                        |
| `rel_darken_oklch`  | `rel_darken_oklch(color, dL)`         | Reduces perceptual lightness by `dL` (keeps `C`/`H`).                                                   | Clamped to `[0..1]`. Use for hover/pressed on light themes.          | `rel_darken_oklch(#6699ff, .06)`                |
| `rel_lighten_oklch` | `rel_lighten_oklch(color, dL)`        | Increases perceptual lightness by `dL` (keeps `C`/`H`).                                                 | Implemented as negative shift under the hood.                        | `rel_lighten_oklch(#3355aa, .08)`               |
| `mix_oklch`         | `mix_oklch(colorA, colorB, t)`        | Interpolates `A→B` in OKLCH using the shortest hue path.                                                | `t∈[0..1]` (also `%`). Very stable blends across hues.               | `mix_oklch(#ff0000, #0000ff, 0.5)` → mid-violet |
| `on_contrast`       | `on_contrast(fg1, fg2, bg[, target])` | Picks `fg1` if contrast ≥ target, else `fg2`. If both fail, auto-adjusts `fg1` lightness toward target. | Default `target=4.5`. Great for generating `on.*` tokens.            | `on_contrast(#000, #fff, #3a3a3a, 4.5)`         |

#### Practical examples

```js

// Label states (light theme), tone-consistent with OKLCH:
label.neutral.primary.hovered = rel_darken_oklch(
  {themes.light.abstracts.label.neutral.primary.base}, 0.06
);

// Surface blend (chips, subtle):
background.accent.tertiary.base = mix_oklch(
  {palette.accent.500},
  {background.neutral.primary.base},
  0.15
);

// Auto "on-" text for any surface with fallback and target contrast:
on.background.neutral.primary.normal = on_contrast(
  {label.neutral.primary.base},
  {label.inversed.base},
  {background.neutral.primary.normal}, 4.5
);

// Construct vivid accent directly in OKLCH:
accent.brand = oklch(0.72 0.14 250);

```

#### Output unit control (rendering)

> How the final string is emitted
> The parser evaluates color expressions to an internal color, then formats it according to the token’s unit:

- hex (default) → #rrggbb or #rrggbbaa
- rgb / rgba
- hsl / hsla
- lab / laba
- oklab (prints oklab(L A B [/ A]))
- oklch (prints oklch(L C H [/ A]))

Example:

```jsonc
{
  "value": "mix_oklch(#e11d48, #1d4ed8, 0.35)",
  "unit": "oklch", // will emit as oklch(L C H)
}
```

#### Programmatic helpers (TypeScript API)

> Useful if you generate tokens or validate palettes outside of inline expressions.

| Method          | Signature                                                      | Purpose                                                                         | Example                                               |
| --------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `contrastRatio` | `(fg: string, bg: string) => number`                           | Returns WCAG contrast ratio using sRGB relative luminance.                      | `parser.contrastRatio('#000', '#fff') // 21`          |
| `pickReadable`  | `(fg1: string, fg2: string, bg: string, target=4.5) => string` | Chooses a readable foreground; auto-nudges `fg1` L toward the target if needed. | `parser.pickReadable('#111', '#fff', '#1f2937', 4.5)` |

## Gotchas & best practices

- Prefer **OKLCH for states** (hover/pressed/disabled): `rel_darken_oklch`/`rel_lighten_oklch` preserve hue and chroma, so the brand doesn’t “muddy”.

- **Use** `mix_oklch` for blending surfaces/overlays; it follows the shortest hue arc to avoid gray midpoints.

- **Guard contrast** with on_contrast. Set `target=3.0` for large text/UI icons; `4.5` for body text.

- **Clamping**: Inputs are softly clamped in conversions; still keep `L∈[0..1]` to avoid out-of-gamut surprises.

- **Refs everywhere**: `{token}` can be used in any argument position; nested function calls are resolved recursively.
