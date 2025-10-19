# TokensParser Configuration Guide

The `TokensParser` can be used both directly in build scripts and via the Vite
plugin (`TokensParserPlugin`). Both entry points share the same declarative
configuration shape, so you can copy‐paste the examples below into
`tokens.config.ts`, `vite.config.ts`, or any custom tooling.

```ts
import { TokensParser } from '@alma/tokens-worker';

const parser = new TokensParser({
  paths: {
    src: './src/tokens/src',
    cache: './src/tokens/.cache',
    out: './src/tokens/output',
    entry: './src/tokens/index.ts',
    scssOut: './src/assets/scss/abstracts',
  },
  include: ['./src/tokens/src/**/*.json', './src/tokens/.cache/**/*.json'],
  naming: {
    prefix: '',
    caseTransform: true,
    includeFileName: true,
  },
  fields: {
    include: ['value', 'respond'],
  },
  targets: {
    scssMap: {
      useDefaultFlag: true,
    },
    cssVars: {
      enabled: false,
    },
    themes: {
      enabled: true,
      input: './src/tokens/output/themes.json',
      output: './src/assets/scss/abstracts/_runtime_themes.scss',
      requireAll: true,
    },
  },
  builder: {
    format: 'json',
    roots: ['./src/tokens/src'],
    includeRootDir: false,
  },
  resolver: {
    fileLookup: false,
    mergeIntoEntry: true,
  },
});

await parser.buildAndParse();
```

## Options Reference

### `mode`

Only used by the Vite plugin wrapper. Defaults match the rest of the pipeline.

| Key     | Type                               | Default   |
| ------- | ---------------------------------- | --------- |
| enforce | `"pre"` \| `"post"`                | `"pre"`   |
| apply   | `"build"` \| `"serve"` \| `"both"` | `"build"` |

### `paths`

Defines the minimal IO contract. `src` and `scssOut` are required.

| Key     | Type   | Required | Description                                     |
| ------- | ------ | -------- | ----------------------------------------------- |
| src     | string | ✅       | Authoring directory with token JSON             |
| scssOut | string | ✅       | Directory for generated SCSS maps               |
| cache   | string |          | Legacy “source” directory (resolved JSON cache) |
| out     | string |          | Destination for resolved JSON bundles           |
| entry   | string |          | TypeScript entry file to regenerate             |

### `include`

Array of glob patterns that trigger rebuilds. If omitted, the parser watches
`paths.src/**/*.json` and `paths.cache/**/*.json` (if cache is provided).

### `naming`

Shared naming rules for SCSS maps and CSS vars.

| Key             | Type    | Default | Notes                             |
| --------------- | ------- | ------- | --------------------------------- |
| prefix          | string  | `""`    | Prepended to keys and var names   |
| caseTransform   | boolean | `false` | Convert keys to kebab case        |
| includeFileName | boolean | `true`  | Append filename fragments to keys |

### `fields`

Controls which service fields are copied into generated maps.

| Key     | Type                          | Default |
| ------- | ----------------------------- | ------- |
| include | boolean \| string \| string[] | `[]`    |

> `true` includes all service fields, `false` includes none,
> passing an array (e.g. `["value","respond"]`) selects explicit fields.

### `targets.scssMap`

| Key            | Type    | Default | Description                        |
| -------------- | ------- | ------- | ---------------------------------- |
| useDefaultFlag | boolean | `true`  | Emit `!default` for generated maps |

### `targets.cssVars`

| Key             | Type                  | Default        | Description                                     |
| --------------- | --------------------- | -------------- | ----------------------------------------------- |
| enabled         | boolean               | `false`        | Enable CSS variable emission                    |
| prefix          | string                | naming prefix  | Override CSS var prefix                         |
| includeFileName | boolean               | naming include | Mirror naming rule in CSS vars                  |
| exclude         | string[]              | `[]`           | Paths excluded from CSS var generation          |
| separateFile    | boolean               | `false`        | Emit variables into `_runtime.*` alongside SCSS |
| fileNamePrefix  | string                | `"_runtime."`  | Prefix for separate CSS var files               |
| prefer          | `"first"` \| `"last"` | `"last"`       | Conflict resolution strategy                    |

### `targets.themes`

| Key        | Type    | Default                                               | Description                          |
| ---------- | ------- | ----------------------------------------------------- | ------------------------------------ |
| enabled    | boolean | `false` (auto-enabled when `input`/`output` provided) | Toggle theme CSS generation          |
| input      | string  | `paths.out + "/themes.json"` (if `paths.out` exists)  | Source themes JSON file              |
| output     | string  | `paths.scssOut + "/_runtime_themes.scss"`             | Destination themes CSS file          |
| requireAll | boolean | `false`                                               | Require `meta.build.web.exportAsVar` |

### `builder`

| Key            | Type                           | Default                    | Description                           |
| -------------- | ------------------------------ | -------------------------- | ------------------------------------- |
| format         | `"json"` \| `"ts"` \| `"yaml"` | `"json"`                   | Format for resolved tokens            |
| roots          | string[]                       | `[paths.src]`              | Source roots for JSON builder         |
| includeRootDir | boolean                        | `false`                    | Include root directory name in output |
| outDir         | string                         | `paths.cache ?? paths.src` | Builder output directory              |

### `resolver`

| Key            | Type    | Default | Description                              |
| -------------- | ------- | ------- | ---------------------------------------- |
| fileLookup     | boolean | `false` | Enable filesystem lookups for references |
| mergeIntoEntry | boolean | `true`  | Merge generated modules into entry file  |

### `parseOptions`

Additional per-value parsing flags (mirrors legacy API). Common overrides:

- `convertPxToRem`
- `includeFileName`

### Command-Line Usage Example

```ts
#!/usr/bin/env tsx
import { TokensParser } from '@alma/tokens-worker';
import tokensConfig from './tokens.config.ts';

const parser = new TokensParser(tokensConfig);
await parser.buildAndParse();
console.log('Tokens compiled successfully!');
```

`tokens.config.ts` may export the same object used in the Vite plugin example.
