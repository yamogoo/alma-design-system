# ColorsGenerator Configuration Guide

`ColorsGeneratorPlugin` converts a root color palette into a set of derivative
tokens (lightness ladder) and writes the results to JSON. The plugin is most
commonly wired into Vite, but the underlying generator can be called directly.

```ts
import ColorsGeneratorPlugin from "@alma/tokens-worker/plugins/vite-plugin-colors-generator";

export default defineConfig({
  plugins: [
    ColorsGeneratorPlugin({
      mode: { enforce: "pre", apply: "build" },
      paths: {
        input: "./src/tokens/src/baseColors.json",
        output: "./src/tokens/src/colors.json",
      },
      generator: {
        levels: 40,
      },
    }),
  ],
});
```

## Options Reference

### `mode`

Matches the conventions used across other Alma Vite plugins.

| Key      | Type                                  | Default   |
|----------|---------------------------------------|-----------|
| enforce  | `"pre"` \| `"post"`                   | `"pre"`   |
| apply    | `"serve"` \| `"build"` \| `"both"`    | `"build"` |

### `paths`

Defines where colors are read from and written to.

| Key     | Type    | Required | Description                    |
|---------|---------|----------|--------------------------------|
| input   | string  | ✅        | Source JSON with seed colors   |
| output  | string  | ✅        | Destination JSON for derivatives |

### `generator`

Tuning knobs for the generator. Only `levels` is required in most setups.

| Key        | Type    | Default | Description                                    |
|------------|---------|---------|------------------------------------------------|
| levels     | number  | `40`    | Number of interpolated lightness steps         |
| comment    | string  | `"# <output> Generated..."` | Custom header comment (currently unused) |
| colorspace | string  | –       | (reserved) Alternative colourspace             |
| strategy   | string  | –       | (reserved) Lightness distribution strategy     |
| gamutClamp | boolean | –       | (reserved) Clamp out-of-gamut values           |
| round      | object  | –       | (reserved) Precision controls                  |
| keys       | object  | –       | (reserved) Custom key format                   |

> **Note:** Only `levels` and `comment` are applied today. The remaining fields
> are documented for forward compatibility.

## Minimal Configuration

```ts
ColorsGeneratorPlugin({
  paths: {
    input: "./src/tokens/src/baseColors.json",
    output: "./src/tokens/src/colors.json",
  },
  generator: { levels: 40 },
});
```

## Using the Generator Directly

```ts
import { generateColorsFromFile } from "@alma/tokens-worker/tools/colors";

generateColorsFromFile({
  source: "./src/tokens/src/baseColors.json",
  outDir: "./src/tokens/src/colors.json",
  step: 40, // same as generator.levels
});
```

This direct call respects the same defaults as the Vite plugin. You can also
toggle advanced behaviour (markdown output, suffix grids, etc.) via
`ColorsGeneratorOptions`.

## Seed File Expectations

The generator traverses the source JSON and collects any value that looks like a
color (HEX string). For example:

```json
{
  "palette": {
    "accent": { "value": "#0FC558" },
    "neutral": { "value": "#1A4FFE" }
  }
}
```

Each seed color becomes a lightness ladder with names based on the JSON path
(`palette-accent-0`, `palette-accent-1000`, etc.).

## Outputs

- `paths.output` – flattened JSON map of generated tokens.
- `_output.json` – legacy underscore variant (compatible with existing tooling).

Enable CSS token generation via `TokensParser` to ensure final SCSS maps inherit
the same colours.
