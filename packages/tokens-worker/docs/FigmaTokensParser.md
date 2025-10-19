# Figma Tokens Parser

Transform resolved design tokens into a Figma–friendly format. The plugin and
parser share the same configuration contract, mirroring the rest of the Alma
tooling.

```ts
import { VitePluginFigmaTokensParser } from "@alma/tokens-worker";

export default defineConfig({
  plugins: [
    VitePluginFigmaTokensParser({
      mode: { enforce: "post", apply: "build" },
      paths: {
        input: "./src/tokens/output",
        output: "./src/tokens/.figma",
      },
      export: {
        format: "figma-json",
        flatten: true,
        include: ["**/*.json"],
        pretty: true,
      },
      resolver: {
        resolveReferences: true,
        keepServiceFields: false,
      },
      verbose: false,
    }),
  ],
});
```

## Options Reference

### `mode`

| Key     | Type                              | Default |
|---------|-----------------------------------|---------|
| enforce | `"pre"` \| `"post"`             | `"post"` |
| apply   | `"serve"` \| `"build"` \| `"both"` | `"build"` |

### `paths`

| Key    | Type   | Required | Description                |
|--------|--------|----------|----------------------------|
| input  | string | ✅        | Directory with source JSON |
| output | string | ✅        | Directory for exported files |

### `export`

| Key      | Type                      | Default         | Description                                 |
|----------|---------------------------|-----------------|---------------------------------------------|
| format   | `"figma-json"` \| `"tokens-studio"` | `"figma-json"` | Reserved for future exporters               |
| flatten  | boolean                   | `true`          | Resolve reference strings to raw values     |
| include  | string[]                  | `["**/*.json"]`| Globs to include                            |
| exclude  | string[]                  | `[]`            | Globs to exclude                            |
| pretty   | boolean                   | `true`          | Pretty-print JSON output                    |

### `resolver`

| Key                | Type    | Default | Description                                         |
|--------------------|---------|---------|-----------------------------------------------------|
| resolveReferences  | boolean | `true`  | Replace `{path.to.token}` references with resolved values |
| keepServiceFields  | boolean | `false` | Preserve `$` service fields (`$description`, etc.)   |
| ignoreUnderscored  | boolean | `true`  | Skip files / folders starting with `_`              |
| ignoreDotfiles     | boolean | `true`  | Skip dotfiles                                       |

### `verbose`

Logs processed files when `true`. Defaults to `false`.

### `watch` / `runOnBuildStart`

Vite plugin–only switches that default to `true`. Disable them if you want to
manage execution manually.

## Direct Usage

```ts
import { runFigmaTokensParser } from "@alma/tokens-worker";

await runFigmaTokensParser({
  paths: {
    input: "./src/tokens/output",
    output: "./src/tokens/.figma",
  },
  export: { include: ["**/*.json"], exclude: ["**/_*.json"] },
  resolver: { resolveReferences: true, keepServiceFields: false },
});
```

## Behaviour Notes

- Padding shorthands (`padding: [8, 12]`) are expanded into explicit
  directional values.
- When `resolveReferences` is enabled, string references such as
  `{colors.primary}` are replaced with the resolved token value (when found).
- Service fields (`$description`, `$extensions`, etc.) are removed by default; set
  `keepServiceFields: true` to preserve them.
- `flatten` currently mirrors `resolveReferences` and ensures the exported JSON
  contains concrete values.
