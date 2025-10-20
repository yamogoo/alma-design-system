// This file were developed with the assistance of AI tools.

import nodePath from 'node:path';

import type { JSONBuilderFormat } from '../parsers/jsonBuilder/types.js';
import type { ParseValueOptions, TokensParserOptions } from '../parsers/tokens/types.js';

type IncludeConfig = string | string[] | undefined;

export type PathsConfig = {
  /** Directory that contains authored token JSON files. */
  src: string;
  /** Directory where SCSS maps (and CSS variables) should be emitted. */
  scssOut: string;
  /** Optional cache directory with resolved JSON (legacy `source`). */
  cache?: string;
  /** Optional output directory for resolved JSON bundles (legacy `build`). */
  out?: string;
  /** Optional TypeScript entry file path (legacy `entryFilePath`). */
  entry?: string;
};

export type NamingConfig = {
  /** Shared prefix for generated map keys and CSS variables. */
  prefix?: string;
  /** Convert keys to kebab-case. */
  caseTransform?: boolean;
  /** Include filename segments in generated keys. */
  includeFileName?: boolean;
};

export type FieldsConfig = {
  /** Which service fields to include in generated maps/CSS vars. */
  include?: boolean | string | string[];
};

export type ScssTargetConfig = {
  /** Emit !default markers for generated SCSS maps. */
  useDefaultFlag?: boolean;
};

export type CssVarsTargetConfig = {
  /** Enable CSS variable generation. */
  enabled?: boolean;
  prefix?: string;
  includeFileName?: boolean;
  exclude?: string[];
  separateFile?: boolean;
  fileNamePrefix?: string;
  prefer?: 'first' | 'last';
};

export type ThemesTargetConfig = {
  enabled?: boolean;
  input?: string;
  output?: string;
  requireAll?: boolean;
};

export type TargetsConfig = {
  scssMap?: ScssTargetConfig;
  cssVars?: CssVarsTargetConfig;
  themes?: ThemesTargetConfig;
};

export type BuilderConfig = {
  format?: JSONBuilderFormat;
  roots?: string[];
  includeRootDir?: boolean;
  outDir?: string;
};

export type ResolverConfig = {
  fileLookup?: boolean;
  mergeIntoEntry?: boolean;
};

export interface TokensParserConfig {
  paths: PathsConfig;
  include?: IncludeConfig;
  naming?: NamingConfig;
  fields?: FieldsConfig;
  targets?: TargetsConfig;
  builder?: BuilderConfig;
  resolver?: ResolverConfig;
  parseOptions?: Partial<ParseValueOptions>;
  verbose?: boolean;
  cssVarsPrefer?: 'first' | 'last';
}

export interface NormalizedTokensParserConfig {
  parserOptions: TokensParserOptions;
  watchGlobs: string[];
}

const toPosix = (value: string): string => value.replace(/\\/g, '/');

const normalizeDir = (dir: string): string => {
  const replaced = toPosix(dir);
  const trimmed = replaced.replace(/\/+$/, '');
  return trimmed.length ? trimmed : '.';
};

const normalizeFile = (file: string): string => toPosix(file);

const ensureArray = <T>(value: T | T[] | undefined): T[] => {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

const deriveBaseDirsFromGlobs = (patterns: string[]): string[] => {
  const globRegex = /[*?[\]{},!()]/;
  return patterns
    .map((pattern) => {
      const posixPattern = toPosix(pattern);
      const idx = posixPattern.search(globRegex);
      const raw = idx === -1 ? posixPattern : posixPattern.slice(0, idx);
      const trimmed = raw.replace(/\/+$/, '');
      if (!trimmed) return '.';

      const hasExt = nodePath.extname(trimmed) !== '';
      const base = hasExt ? nodePath.dirname(trimmed) : trimmed;
      return base || '.';
    })
    .filter(Boolean);
};

export function normalizeTokensParserConfig(
  config: TokensParserConfig,
): NormalizedTokensParserConfig {
  if (!config.paths?.src) {
    throw new Error('[tokens-parser] paths.src is required');
  }
  if (!config.paths?.scssOut) {
    throw new Error('[tokens-parser] paths.scssOut is required');
  }

  const normalizedPaths = {
    src: normalizeDir(config.paths.src),
    scssOut: normalizeDir(config.paths.scssOut),
    cache: config.paths.cache ? normalizeDir(config.paths.cache) : undefined,
    out: config.paths.out ? normalizeDir(config.paths.out) : undefined,
    entry: config.paths.entry ? normalizeFile(config.paths.entry) : undefined,
  };

  const includePatterns = (() => {
    if (config.include != null) {
      return ensureArray(config.include).map(toPosix);
    }
    const defaults = [`${normalizedPaths.src}/**/*.json`];
    if (normalizedPaths.cache) defaults.push(`${normalizedPaths.cache}/**/*.json`);
    return defaults;
  })();

  const naming = config.naming ?? {};
  const namingPrefix = naming.prefix ?? '';
  const namingCaseTransform = naming.caseTransform ?? false;
  const namingIncludeFile = naming.includeFileName ?? true;

  const fields = config.fields ?? {};
  const rawFields = fields.include;
  let includeServiceFields: any = [];
  if (rawFields === true || rawFields === false) {
    includeServiceFields = rawFields;
  } else if (typeof rawFields === 'string') {
    includeServiceFields = [rawFields];
  } else if (Array.isArray(rawFields)) {
    includeServiceFields = rawFields;
  }

  const targets = config.targets ?? {};
  const scssTarget = targets.scssMap ?? {};
  const cssVarsTarget = targets.cssVars ?? {};
  const themesTarget = targets.themes ?? {};

  const builder = config.builder ?? {};
  const builderRoots =
    builder.roots?.length && builder.roots.length > 0
      ? builder.roots.map(normalizeDir)
      : [normalizedPaths.src];
  const builderOutDir = builder.outDir
    ? normalizeDir(builder.outDir)
    : normalizedPaths.cache ?? normalizedPaths.src;
  const builderFormat: JSONBuilderFormat = builder.format ?? 'json';

  const resolver = config.resolver ?? {};

  const cssVarsEnabled = cssVarsTarget.enabled ?? false;
  const cssVarsPrefix = cssVarsTarget.prefix ?? namingPrefix;
  const cssVarsIncludeFile = cssVarsTarget.includeFileName ?? namingIncludeFile;
  const cssVarsExclude = cssVarsTarget.exclude ?? [];
  const cssVarsSeparate = cssVarsTarget.separateFile ?? false;
  const cssVarsFileNamePrefix = cssVarsTarget.fileNamePrefix ?? '_runtime.';
  const cssVarsPrefer = cssVarsTarget.prefer ?? config.cssVarsPrefer;

  const themesEnabled =
    themesTarget.enabled ?? Boolean(themesTarget.input || themesTarget.output);
  const themesInput =
    themesTarget.input ??
    (normalizedPaths.out ? `${normalizedPaths.out}/themes.json` : undefined);
  const themesOutput =
    themesTarget.output ?? `${normalizedPaths.scssOut}/_runtime_themes.scss`;

  const parserOptions: TokensParserOptions = {
    source: normalizedPaths.src,
    cacheDir: builderOutDir,
    outDir: normalizedPaths.scssOut,
    build: normalizedPaths.out,
    entryFilePath: normalizedPaths.entry,
    parseOptions: config.parseOptions,
    verbose: config.verbose,
    cssVarsPrefer,
    mapOptions: {
      prefix: namingPrefix,
      convertCase: namingCaseTransform,
      includeFileName: namingIncludeFile,
      includeServiceFields,
      scssUseDefaultFlag: scssTarget.useDefaultFlag ?? true,
    },
    cssVarOptions: {
      prefix: cssVarsPrefix,
      convertToCSSVariables: cssVarsEnabled,
      includeFileNameToCSSVariables: cssVarsIncludeFile,
      excludeCSSVariables: cssVarsExclude,
      useSeparateFile: cssVarsSeparate,
      fileNamePrefix: cssVarsFileNamePrefix,
    },
    builder: {
      format: builderFormat,
      outDir: builderOutDir,
      paths: builderRoots,
      includeRootDirName: builder.includeRootDir ?? false,
    },
    useFileStructureLookup: resolver.fileLookup ?? false,
    isModulesMergedIntoEntry: resolver.mergeIntoEntry ?? true,
  };

  const resolverPathSet = new Set<string>();
  const addResolverPath = (dir?: string) => {
    if (!dir) return;
    resolverPathSet.add(normalizeDir(dir));
  };

  addResolverPath(normalizedPaths.src);
  addResolverPath(normalizedPaths.cache);
  builderRoots.forEach(addResolverPath);
  const includeDirs = deriveBaseDirsFromGlobs(includePatterns);
  includeDirs.forEach(addResolverPath);
  addResolverPath(builderOutDir);
  deriveBaseDirsFromGlobs(includePatterns).forEach(addResolverPath);

  parserOptions.paths = Array.from(resolverPathSet);

  if (themesEnabled && themesInput) {
    parserOptions.themesDir = normalizeFile(themesInput);
    parserOptions.themesOutFile = normalizeFile(themesOutput);
    parserOptions.themesIncludeRequired = themesTarget.requireAll ?? false;
  }

  return {
    parserOptions,
    watchGlobs: includePatterns,
  };
}
