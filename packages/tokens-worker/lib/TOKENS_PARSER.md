# "Tokens Parser Plugin"

"Internal plugin for compiling Alma Design System tokens to SCSS maps, CSS variables, and themes."

## Tokens Parser Plugin

### `@alma/design-system` internal tool

## ⚙️ Basic Usage

```ts
import { TokensParserPlugin } from '@alma/design-system/plugins';

export default defineConfig({
  plugins: [
    TokensParserPlugin({
      paths: {
        src: './src/tokens/src',
        scssOut: './src/assets/scss/abstracts',
      },
    }),
  ],
});
```

By default, the plugin:

- Scans all \*.json files under paths.src
- Resolves $value, $type, $respond, and token references
- Emits SCSS maps and optional runtime CSS variables
- Generates theme SCSS from themes.json (if present)

## Configuration Reference

#### `mode`

```ts
mode?: {
  enforce?: "pre" | "post";
  apply?: "serve" | "build";
};
```

Controls when the plugin executes during the Vite lifecycle.
Default: { enforce: "pre", apply: "build" }

#### `paths`

```ts
paths: {
  src: string;       // Required — main tokens source
  cache?: string;    // Intermediate .cache directory
  out?: string;      // JSON build output directory
  entry?: string;    // Index entry file
  scssOut: string;   // Target directory for generated SCSS
};
```

Defines the project token structure.

#### `include`

```ts
include?: string[];
```

Glob patterns for JSON files to include.
Default: all JSON files in paths.src and paths.cache (if defined).

#### `naming`

```ts
naming?: {
  prefix?: string;           // e.g. "alma"
  caseTransform?: boolean;   // convert keys to kebab-case
  includeFileName?: boolean; // append file name to key
};
```

Controls how keys and CSS variable names are built.

#### `fields`

```ts
fields?: {
  include?: string[]; // Which service fields to propagate
};
```

Determines which service fields ($value, $respond, etc.) are included in output.

#### `targets`

`targets.scssMap`

```ts
targets?: {
  scssMap?: {
    useDefaultFlag?: boolean; // Add !default flag
  };
}
```
