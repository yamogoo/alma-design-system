// This file were developed with the assistance of AI tools.

import type { FigmaTokensParserOptions } from '../parsers/figma/types.js';

export type FigmaExportFormat = 'figma-json' | 'tokens-studio';

export type FigmaModeConfig = {
  enforce?: 'pre' | 'post';
  apply?: 'build' | 'serve' | 'both';
};

export type FigmaPathsConfig = {
  input: string;
  output: string;
};

export type FigmaExportConfig = {
  format?: FigmaExportFormat;
  flatten?: boolean;
  include?: string[];
  exclude?: string[];
  pretty?: boolean;
};

export type FigmaResolverConfig = {
  resolveReferences?: boolean;
  keepServiceFields?: boolean;
  ignoreUnderscored?: boolean;
  ignoreDotfiles?: boolean;
};

export interface FigmaTokensParserConfig {
  mode?: FigmaModeConfig;
  paths: FigmaPathsConfig;
  export?: FigmaExportConfig;
  resolver?: FigmaResolverConfig;
  verbose?: boolean;
  watch?: boolean;
  runOnBuildStart?: boolean;
}

export interface NormalizedFigmaTokensParserConfig {
  parserOptions: FigmaTokensParserOptions;
  watchGlobs: string[];
  mode: FigmaModeConfig;
  watch: boolean;
  runOnBuildStart: boolean;
}

const DEFAULT_EXPORT: Required<FigmaExportConfig> = {
  format: 'figma-json',
  flatten: true,
  include: ['**/*.json'],
  exclude: [],
  pretty: true,
};

const DEFAULT_RESOLVER: Required<
  Pick<FigmaResolverConfig, 'resolveReferences' | 'keepServiceFields'>
> &
  Pick<FigmaResolverConfig, 'ignoreUnderscored' | 'ignoreDotfiles'> = {
  resolveReferences: true,
  keepServiceFields: false,
  ignoreUnderscored: true,
  ignoreDotfiles: true,
};

const toPosix = (value: string): string => value.replace(/\\/g, '/');

const normalizeDir = (dir: string): string => {
  const normalized = toPosix(dir).replace(/\/+$/g, '');
  return normalized.length ? normalized : '.';
};

export function normalizeFigmaTokensParserConfig(
  config: FigmaTokensParserConfig,
): NormalizedFigmaTokensParserConfig {
  if (!config?.paths?.input) {
    throw new Error('[figma-tokens-parser] paths.input is required');
  }
  if (!config?.paths?.output) {
    throw new Error('[figma-tokens-parser] paths.output is required');
  }

  const mode: FigmaModeConfig = {
    enforce: config.mode?.enforce ?? 'post',
    apply: config.mode?.apply ?? 'build',
  };

  const resolvedPaths = {
    input: normalizeDir(config.paths.input),
    output: normalizeDir(config.paths.output),
  };

  const exportConfig: Required<FigmaExportConfig> = {
    ...DEFAULT_EXPORT,
    ...(config.export ?? {}),
    include:
      config.export?.include?.length && config.export.include.length > 0
        ? config.export.include.map(toPosix)
        : DEFAULT_EXPORT.include,
    exclude: (config.export?.exclude ?? []).map(toPosix),
  } as Required<FigmaExportConfig>;

  const resolverConfig: FigmaResolverConfig = {
    ...DEFAULT_RESOLVER,
    ...(config.resolver ?? {}),
  };

  const parserOptions: FigmaTokensParserOptions = {
    source: resolvedPaths.input,
    outDir: resolvedPaths.output,
    includeGlobs: exportConfig.include,
    excludeGlobs: exportConfig.exclude,
    flatten: exportConfig.flatten,
    resolveReferences: resolverConfig.resolveReferences,
    keepServiceFields: resolverConfig.keepServiceFields,
    pretty: exportConfig.pretty,
    ignoreUnderscored: resolverConfig.ignoreUnderscored ?? true,
    ignoreDotfiles: resolverConfig.ignoreDotfiles ?? true,
    verbose: config.verbose ?? false,
  };

  const watch = config.watch ?? true;
  const runOnBuildStart = config.runOnBuildStart ?? true;

  return {
    parserOptions,
    watchGlobs: exportConfig.include,
    mode,
    watch,
    runOnBuildStart,
  };
}
