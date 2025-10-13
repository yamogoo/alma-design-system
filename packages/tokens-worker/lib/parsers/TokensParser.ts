// Portions of this file were developed with the assistance of AI tools.

import fs from 'node:fs/promises';
import nodePath from 'node:path';
import { readFileSync, statSync } from 'node:fs';
import * as _ from 'lodash-es';

import Color from 'color';

import { JSONBuilder, type JSONBuilderOptions } from './JSONBuilder.js';

/* * * Common Types * * */

export type List<T> = Array<T>;

export interface TokenObj {
  value?: string | number;
  type?: string;
  unit?: string;
  meta: {
    description?: string;
    category?: string;
    build?: {
      web?: {
        exportAsVar?: boolean;
        varName?: string;
        status?: 'unused' | 'active';
      };
      ios: {
        applyMultiplier?: boolean;
        status?: 'unused' | 'active';
      };
      android: {
        applyMultiplier?: boolean;
        status?: 'unused' | 'active';
      };
    };
  };
}

export interface IMap extends TokenObj {
  [key: string]: Value<unknown>;
}

export type Value<T> = string | number | List<T> | T | IMap;

export type ServiceField = 'value' | 'type' | 'unit' | 'meta' | 'respond';
export type IncludeServiceFields = ('*' | 'all' | 'none' | 'core' | ServiceField)[] | boolean;

export interface ParseValueOptions {
  prefix?: string;
  convertPxToRem: boolean;
  convertCase?: boolean;
  includeFileName?: boolean;
  scssUseDefaultFlag?: boolean;
  convertToCSSVariables?: boolean;
  includeFileNameToCSSVariables?: boolean;
  excludeCSSVariables?: string[];
  fileName?: string;
  key?: string;
  unit?: string;
  includeServiceFields?: IncludeServiceFields;
  includeSymbolsInServiceFields?: boolean;
}

export interface JSONToSCSSOptions {
  name: string;
  header: string;
  comment: string;
  options: Partial<ParseValueOptions>;
  mapOptions?: Partial<ParseValueOptions>;
}

export interface CssVarOptions {
  prefix?: string;
  convertToCSSVariables?: boolean;
  includeFileNameToCSSVariables?: boolean;
  excludeCSSVariables?: string[];
  useSeparateFile?: boolean;
  fileNamePrefix?: string;
}

export interface TokensParserOptions {
  builder?: JSONBuilderOptions;
  source?: string;
  paths?: string[];
  outDir: string;
  cssVarsOutDir?: string;
  build?: string;
  entryFilePath?: string;
  mapOptions?: Partial<ParseValueOptions>;
  cssVarOptions?: CssVarOptions;
  parseOptions?: Partial<ParseValueOptions>;
  useFileStructureLookup?: boolean; // Enables folder-structure lookup for token references.
  isModulesMergedIntoEntry?: boolean;
  themesDir?: string;
  themesOutFile?: string; // SCSS output file path.
  themesIncludeRequired?: boolean;
  /** Enable verbose logs (warnings/info) */
  verbose?: boolean;
  /** CSS vars conflict resolution: first|last (default: last) */
  cssVarsPrefer?: 'first' | 'last';
}

/* * * Abstract Parser * * */

abstract class Parser {
  abstract parseValue<T>(value: Value<T>, opts: ParseValueOptions): Value<T>;
  abstract parseList(list: List<unknown>, opts: ParseValueOptions): string;
  abstract parseMap<T extends object>(
    map: Value<T>,
    opts: ParseValueOptions,
    path?: string[],
  ): string;
}

/* * * SCSS Parser * * */

export class SCSSParser extends Parser {
  private tokensParser: TokensParser;

  private applyCssVarPrefix(name: string, prefix?: string): string {
    if (!prefix) return name;
    if (name.startsWith('--')) {
      const rest = name.slice(2);
      return `--${prefix}-${rest}`;
    }
    return `${prefix}-${name}`;
  }

  // Tracks CSS variable values for deduplication and predictable overrides.
  private collectedCssVars: Map<string, string> = new Map();

  constructor(tokensParser: TokensParser) {
    super();
    this.tokensParser = tokensParser;
  }

  // Clears accumulated CSS variables to avoid duplication between files.
  public clearCssVars() {
    this.collectedCssVars.clear();
  }

  private normalizeValue(value: any, opts: ParseValueOptions): string {
    // Handles nested token references such as "{file.key}".
    if (_.isString(value) && value.startsWith('{')) {
      const nested = this.tokensParser.parseNestedValue(value, opts);
      // Avoids infinite recursion if the reference cannot be resolved.
      if (nested === value) {
        return value;
      }
      return this.normalizeValue(nested, opts);
    }

    if (typeof value === 'number') {
      return this.tokensParser.convertNumberByKey(value, opts.key, opts);
    }

    if (typeof value === 'string') {
      // Attempts to recognize color expressions and format them to the requested unit.
      const colorMaybe = this.tokensParser.tryParseColor(value, opts.unit);
      if (colorMaybe) return colorMaybe;

      // Treats numeric strings like numbers.
      if (/^\d+(\.\d+)?$/.test(value)) {
        return this.tokensParser.convertNumberByKey(Number(value), opts.key, opts);
      }
      // Preserves values that already include units.
      if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) {
        return value;
      }
      return value;
    }

    if (_.isArray(value)) {
      return value.map((v) => this.normalizeValue(v, opts)).join(' ');
    }

    if (_.isPlainObject(value)) {
      // Handles token objects with standard value/type/unit/meta fields.
      if (this.tokensParser.hasTokenField(value, 'value')) {
        const localOpts: ParseValueOptions = {
          ...opts,
          key:
            typeof this.tokensParser.getTokenField(value, 'type') === 'string'
              ? (this.tokensParser.getTokenField(value, 'type') as string)
              : opts.key,
          unit: (() => {
            const hasUnit = this.tokensParser.hasTokenField(value, 'unit');
            const unitVal = this.tokensParser.getTokenField(value, 'unit');
            return hasUnit && typeof unitVal === 'string' ? unitVal : opts.unit;
          })(),
        };
        return this.normalizeValue(this.tokensParser.getTokenField(value, 'value'), localOpts);
      }
      // Delegates plain objects to map parsing.
      return this.parseMap(value as IMap, opts);
    }

    return String(value);
  }

  parseValue(value: any, opts: ParseValueOptions): string {
    return this.normalizeValue(value, opts);
  }

  parseList(list: List<unknown>, opts: ParseValueOptions): string {
    return list.map((v) => this.normalizeValue(v, opts)).join(' ');
  }

  private serializeMeta(meta: any, _opts: ParseValueOptions, path: string[] = []): string {
    if (!meta) return '()';

    const entries = Object.entries(meta).map(([k, v]) => {
      if (_.isPlainObject(v)) {
        return `${k}: ${this.serializeMeta(v, _opts, [...path, k])}`;
      } else if (_.isArray(v)) {
        const arr = v
          .map((i) => (_.isPlainObject(i) ? this.serializeMeta(i, _opts, [...path, k]) : `"${i}"`))
          .join(', ');
        return `${k}: (\n    ${arr}\n  )`;
      } else {
        const normalized = this.normalizeValue(v, _opts);
        const out =
          typeof normalized === 'string' && /^".*"$/.test(normalized)
            ? normalized
            : `"${String(normalized)}"`;
        return `${k}: ${out}`;
      }
    });

    return `(\n  ${entries.join(',\n  ')}\n)`;
  }

  parseMap<T extends object>(map: Value<T>, opts: ParseValueOptions, path: string[] = []): string {
    // Handles primitive passthrough values.
    if (typeof map === 'string') return this.normalizeValue(map, opts);
    if (_.isArray(map)) return this.parseList(map, opts);
    if (!_.isPlainObject(map)) return this.normalizeValue(map, opts);

    const obj = map as IMap;
    const keys = Object.keys(obj);

    // Detects token-like objects by checking for token metadata fields.
    const hasTokenFields = [
      'value',
      '$value',
      'type',
      '$type',
      'unit',
      '$unit',
      'description',
      'meta',
      '$meta',
      'respond',
      '$respond',
    ].some((k) => keys.includes(k));

    // Computes candidate file paths for CSS variable exclusion checks.
    const buildExcludeCandidates = (): string[] => {
      const candidates: string[] = [];
      const fileName = opts?.fileName ?? '';
      if (fileName) candidates.push(fileName, `${fileName}.json`);

      const buildRoot = this.tokensParser.opts.build;
      if (buildRoot && fileName) {
        try {
          candidates.push(nodePath.resolve(buildRoot, `${fileName}.json`));
        } catch {}
      }

      const sourceRoot = this.tokensParser.opts.source;
      if (sourceRoot && fileName) {
        try {
          candidates.push(nodePath.resolve(sourceRoot, `${fileName}.json`));
        } catch {}
      }

      for (const p of this.tokensParser.opts.paths ?? []) {
        if (fileName) {
          try {
            candidates.push(nodePath.resolve(p, `${fileName}.json`));
          } catch {}
        }
      }

      return [...new Set(candidates)].map((c) => (c || '').replace(/\\/g, '/').toLowerCase());
    };
    const matchesExcluded = (excludedRaw: string, candidates: string[]) => {
      if (!excludedRaw) return false;
      const excluded = excludedRaw.replace(/\\/g, '/').toLowerCase();
      if (excluded.endsWith('/')) return candidates.some((c) => c.startsWith(excluded));
      return candidates.some(
        (c) => c === excluded || c.endsWith(`/${excluded}`) || excluded.endsWith(`/${c}`),
      );
    };

    // Handles token objects.
    if (hasTokenFields) {
      const tokenObj = obj as IMap;

      // Determines whether to emit $-prefixed service fields in the SCSS map.
      const includeCfg = this.tokensParser.resolveIncludeServiceFields(opts);
      const want = (name: 'value' | 'type' | 'unit' | 'meta' | 'respond') =>
        includeCfg.includeAll || includeCfg.set.has(name);

      const serviceMode = includeCfg.includeAll || includeCfg.set.size > 0;

      const serviceSymbols =
        (opts.includeSymbolsInServiceFields ??
          this.tokensParser.opts?.mapOptions?.includeSymbolsInServiceFields ??
          false) === true;

      const svc = (name: string) => (serviceSymbols ? `$${name}` : name);

      // Reads canonical token fields, supporting plain and $-prefixed keys.
      const metaVal = this.tokensParser.getTokenField(tokenObj, 'meta');
      const typeVal = this.tokensParser.getTokenField(tokenObj, 'type');
      const unitVal = this.tokensParser.getTokenField(tokenObj, 'unit');
      const valueVal = this.tokensParser.getTokenField(tokenObj, 'value');
      const respondVal = this.tokensParser.getField<any>(tokenObj, 'respond'); // Accepts both $respond and respond.

      // Collects CSS variables when export conditions are met.
      const excludeList =
        this.tokensParser.opts?.cssVarOptions?.excludeCSSVariables ??
        this.tokensParser.opts?.mapOptions?.excludeCSSVariables ??
        [];
      const candidates = buildExcludeCandidates();
      let isExcluded = false;
      for (const excludedRaw of excludeList) {
        if (matchesExcluded(excludedRaw, candidates)) {
          isExcluded = true;
          break;
        }
      }

      const globalMapFlag =
        this.tokensParser.opts?.cssVarOptions?.convertToCSSVariables ??
        this.tokensParser.opts?.mapOptions?.convertToCSSVariables ??
        false;
      const localMapFlag = opts?.convertToCSSVariables ?? false;
      const shouldExportAsVar =
        !isExcluded &&
        (Boolean(metaVal?.build?.web?.exportAsVar) ||
          Boolean(localMapFlag) ||
          Boolean(globalMapFlag));

      if (shouldExportAsVar && valueVal !== undefined) {
        let explicitVarName = metaVal?.build?.web?.varName;
        if (typeof explicitVarName === 'string' && explicitVarName.includes('{')) {
          const resolved = this.tokensParser.parseNestedValue(
            explicitVarName,
            this.tokensParser.defaultParseOptions,
          );
          explicitVarName = String(resolved);
        }
        const pathPart = path.filter(Boolean).join('-');
        const filePart = opts.fileName
          ? opts.convertCase
            ? this.tokensParser.toKebabCase(opts.fileName)
            : opts.fileName
          : '';
        let computedNameSource = explicitVarName
          ? explicitVarName
          : pathPart || (filePart ? `${filePart}` : '');
        const includeFileNameToCSS =
          this.tokensParser.opts?.cssVarOptions?.includeFileNameToCSSVariables ??
          this.tokensParser.opts?.mapOptions?.includeFileNameToCSSVariables ??
          false;

        if (!explicitVarName && includeFileNameToCSS && filePart) {
          if (!computedNameSource.startsWith(filePart)) {
            computedNameSource = computedNameSource
              ? `${filePart}-${computedNameSource}`
              : filePart;
          }
        }

        let varName =
          computedNameSource && computedNameSource.startsWith('--')
            ? computedNameSource
            : `--${computedNameSource || opts.fileName || 'token'}`;

        // prefix priority: local (opts.prefix / mapOptions) -> global (cssVarOptions.prefix)
        const effectivePrefix =
          (opts.prefix && opts.prefix.length ? opts.prefix : undefined) ??
          (this.tokensParser.opts.mapOptions?.prefix &&
          this.tokensParser.opts.mapOptions?.prefix !== ''
            ? this.tokensParser.opts.mapOptions?.prefix
            : undefined) ??
          (this.tokensParser.opts.cssVarOptions?.prefix &&
          this.tokensParser.opts.cssVarOptions?.prefix !== ''
            ? this.tokensParser.opts.cssVarOptions?.prefix
            : undefined) ??
          '';

        if (effectivePrefix) {
          varName = this.applyCssVarPrefix(varName, effectivePrefix);
        }

        const localOptsForVar: ParseValueOptions = {
          ...opts,
          key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
          unit:
            this.tokensParser.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
              ? (unitVal as string)
              : opts.unit,
        };

        let cssValue: string | undefined;
        if (_.isPlainObject(valueVal) || Array.isArray(valueVal)) {
          cssValue = this.parseMap(valueVal as any, localOptsForVar, [...path, 'value']);
        } else {
          cssValue = this.normalizeValue(valueVal, localOptsForVar);
        }

        if (cssValue !== undefined && cssValue !== 'undefined') {
          const prev = this.collectedCssVars.get(varName);
          if (prev !== undefined && prev !== cssValue && this.tokensParser.opts.verbose) {
            console.warn(
              `⚠️ CSS var conflict for "${varName}": "${prev}" -> "${cssValue}" (using ${(this.tokensParser.opts.cssVarsPrefer ?? 'last') === 'last' ? 'last' : 'first'})`,
            );
          }
          const prefer = this.tokensParser.opts.cssVarsPrefer ?? 'last';
          if (prev === undefined || prefer === 'last') this.collectedCssVars.set(varName, cssValue);
        }
      }

      // Serializes arbitrary meta objects into nested SCSS maps.
      const serializeMeta = (meta: any) =>
        this.serializeMeta(meta, opts, [...path, serviceMode ? svc('meta') : 'meta']);

      // Derives parse options for the token value while propagating type and unit.
      const localOpts: ParseValueOptions = {
        ...opts,
        key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
        unit:
          this.tokensParser.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
            ? (unitVal as string)
            : opts.unit,
        includeServiceFields: opts.includeServiceFields,
      };

      // Serializes a token value into the service-field map structure ($value, $type, $unit).
      const serializeServiceToken = (
        val: any,
        tVal: any,
        uVal: any,
        pth: string[],
      ): string | null => {
        const normalized = this.normalizeValue(val, {
          ...localOpts,
          key: typeof tVal === 'string' ? tVal : localOpts.key,
        });

        let rendered = normalized;
        if (String(tVal) === 'string') {
          rendered = /^".*"$/.test(String(normalized))
            ? String(normalized)
            : `"${String(normalized)}"`;
        }

        const items: string[] = [];

        if (want('value')) items.push(`${svc('value')}: ${rendered}`);
        if (tVal !== undefined && want('type'))
          items.push(`${svc('type')}: "${this.normalizeValue(tVal, opts)}"`);
        if (uVal !== undefined && want('unit'))
          items.push(`${svc('unit')}: "${this.normalizeValue(uVal, opts)}"`);

        if (items.length === 0) return null;

        return `(\n  ${items.join(',\n  ')}\n)`;
      };

      const serializeRespond = (resp: any, pth: string[]): string => {
        if (!_.isPlainObject(resp)) return '()';

        const entries: string[] = [];

        for (const [rk, rv] of Object.entries(resp)) {
          const key = opts.convertCase ? this.tokensParser.toKebabCase(rk) : rk;

          if (_.isPlainObject(rv) && this.tokensParser.hasTokenField(rv, 'value')) {
            const t = this.tokensParser.getTokenField(rv, 'type');
            const u = this.tokensParser.getTokenField(rv, 'unit');
            const v = this.tokensParser.getTokenField(rv, 'value');

            const tokenMap = serializeServiceToken(v, t, u, [...pth, key]);
            if (tokenMap) entries.push(`${key}: ${tokenMap}`);
            continue;
          }

          if (_.isPlainObject(rv)) {
            const innerParts: string[] = [];

            for (const [ik, iv] of Object.entries(rv as Record<string, unknown>)) {
              const ikb = opts.convertCase ? this.tokensParser.toKebabCase(ik) : ik;

              if (_.isPlainObject(iv) && this.tokensParser.hasTokenField(iv, 'value')) {
                const t = this.tokensParser.getTokenField(iv, 'type');
                const u = this.tokensParser.getTokenField(iv, 'unit');
                const v = this.tokensParser.getTokenField(iv, 'value');

                const tokenMap = serializeServiceToken(v, t, u, [...pth, key, ikb]);
                if (tokenMap) innerParts.push(`${ikb}: ${tokenMap}`);
              } else {
                const sub = serializeRespond(iv, [...pth, key, ikb]);
                if (sub !== '(\n  \n)') innerParts.push(`${ikb}: ${sub}`);
              }
            }

            if (innerParts.length > 0) {
              entries.push(`${key}: (\n  ${innerParts.join(',\n  ')}\n)`);
            }
            continue;
          }

          const prim = this.normalizeValue(rv, localOpts);
          const val = String(prim);
          entries.push(`${key}: ${/^".*"$/.test(val) ? val : `"${val}"`}`);
        }

        if (entries.length === 0) return '(\n  \n)';
        return `(\n  ${entries.join(',\n  ')}\n)`;
      };

      // Service mode emits $-prefixed fields.
      if (serviceMode) {
        const parts: string[] = [];

        if (valueVal !== undefined && want('value')) {
          let out = this.normalizeValue(valueVal, localOpts);
          if (String(typeVal) === 'string') {
            out = /^".*"$/.test(String(out)) ? String(out) : `"${String(out)}"`;
          }
          parts.push(`${svc('value')}: ${out}`);
        }
        if (typeVal !== undefined && want('type')) {
          parts.push(`${svc('type')}: "${this.normalizeValue(typeVal, opts)}"`);
        }
        if (unitVal !== undefined && want('unit')) {
          parts.push(`${svc('unit')}: "${this.normalizeValue(unitVal, opts)}"`);
        }
        if (metaVal !== undefined && want('meta')) {
          parts.push(`${svc('meta')}: ${serializeMeta(metaVal)}`);
        }
        if (respondVal !== undefined && want('respond')) {
          parts.push(
            `${svc('respond')}: ${serializeRespond(respondVal, [...path, svc('respond')])}`,
          );
        }

        // Includes additional non-service keys for completeness.
        const excluded = new Set([
          'value',
          'type',
          'unit',
          'meta',
          'respond',
          '$value',
          '$type',
          '$unit',
          '$meta',
          '$respond',
        ]);
        const extraKeys = keys.filter((k) => {
          if (excluded.has(k)) return false;
          if (k === 'description') return _.isPlainObject((map as IMap)[k]);
          return true;
        });
        for (const extraKey of extraKeys) {
          const kebabKey = opts.convertCase ? this.tokensParser.toKebabCase(extraKey) : extraKey;
          const value = this.parseMap((map as IMap)[extraKey] as Value<object>, opts, [
            ...path,
            kebabKey,
          ]);
          parts.push(`${kebabKey}: ${value}`);
        }

        return `(\n  ${parts.join(',\n  ')}\n)`;
      }

      // Reflect mode emits standard token fields.
      const parts: string[] = [];

      // Writes the token value.
      if (valueVal !== undefined) {
        if (_.isPlainObject(valueVal)) {
          parts.push(`value: ${this.parseMap(valueVal as any, opts, [...path, 'value'])}`);
        } else if (Array.isArray(valueVal)) {
          parts.push(`value: ${this.parseList(valueVal as any[], opts)}`);
        } else {
          parts.push(
            `value: ${this.normalizeValue(valueVal, {
              ...opts,
              key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
              unit:
                this.tokensParser.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
                  ? (unitVal as string)
                  : opts.unit,
            })}`,
          );
        }
      }

      // Writes scalar metadata fields such as type, unit, and description.
      if (typeVal !== undefined) parts.push(`type: "${this.normalizeValue(typeVal, opts)}"`);
      if (unitVal !== undefined) parts.push(`unit: "${this.normalizeValue(unitVal, opts)}"`);
      if (
        (tokenObj as any).description !== undefined &&
        !_.isPlainObject((tokenObj as any).description)
      ) {
        const parsed = this.normalizeValue((tokenObj as any).description, opts);
        parts.push(`description: "${parsed}"`);
      }

      // Serializes meta information.
      if (metaVal !== undefined) parts.push(`meta: ${serializeMeta(metaVal)}`);

      // Copies additional keys while skipping service fields; respond remains excluded in this mode.
      const excluded = new Set([
        'value',
        'type',
        'unit',
        'meta',
        'respond',
        '$value',
        '$type',
        '$unit',
        '$meta',
        '$respond',
      ]);
      const extraKeys = keys.filter((k) => {
        if (excluded.has(k)) return false;
        if (k === 'description') return _.isPlainObject((map as IMap)[k]);
        return true;
      });
      for (const extraKey of extraKeys) {
        const kebabKey = opts.convertCase ? this.tokensParser.toKebabCase(extraKey) : extraKey;
        const value = this.parseMap((map as IMap)[extraKey] as Value<object>, opts, [
          ...path,
          kebabKey,
        ]);
        parts.push(`${kebabKey}: ${value}`);
      }

      return `(\n  ${parts.join(',\n  ')}\n)`;
    }

    // Recurses into plain objects and returns an SCSS map representation.
    const nestedParts: string[] = [];
    for (const [k, v] of Object.entries(map as Record<string, any>)) {
      if (!this.tokensParser.isKeyValidated(k)) continue;
      const kebabKey = opts.convertCase ? this.tokensParser.toKebabCase(k) : k;

      // Strips description only inside meta blocks.
      if (k === 'description' && path[path.length - 1] === 'meta') continue;

      const value = this.parseMap(v as any, opts, [...path, kebabKey]);
      nestedParts.push(`${kebabKey}: ${value}`);
    }
    return `(\n  ${nestedParts.join(',\n  ')}\n)`;
  }

  public getCssVarsBlock(): string {
    if (this.collectedCssVars.size === 0) return '';
    const lines = [...this.collectedCssVars.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => `  ${name}: ${value};`);
    return `\n:root {\n${lines.join('\n')}\n}\n`;
  }
}

/* * * TokensParser * * */

export class TokensParser {
  parser: Parser;
  opts: TokensParserOptions;
  defaultParseOptions: ParseValueOptions;
  defaultMapOptions: ParseValueOptions;
  fileCache: Record<string, any> = {};

  constructor(opts: TokensParserOptions) {
    this.opts = {
      ...opts,
      verbose: opts.verbose ?? false,
      cssVarsPrefer: opts.cssVarsPrefer ?? 'last',
      isModulesMergedIntoEntry: opts.isModulesMergedIntoEntry ?? true,

      mapOptions: {
        prefix: opts.mapOptions?.prefix ?? '',
        scssUseDefaultFlag: opts.mapOptions?.scssUseDefaultFlag ?? true,
        convertCase: opts.mapOptions?.convertCase ?? false,
        includeFileName: opts.mapOptions?.includeFileName ?? true,
        convertToCSSVariables: opts.mapOptions?.convertToCSSVariables ?? false, // Legacy fallback for older builds.
        includeFileNameToCSSVariables: opts.mapOptions?.includeFileNameToCSSVariables ?? false, // Legacy fallback for older builds.
        excludeCSSVariables: opts.mapOptions?.excludeCSSVariables ?? [], // Legacy fallback for older builds.
        includeServiceFields: opts.mapOptions?.includeServiceFields ?? [],
        includeSymbolsInServiceFields: opts.mapOptions?.includeSymbolsInServiceFields ?? false,
      },

      cssVarOptions: {
        prefix: opts.cssVarOptions?.prefix ?? opts.mapOptions?.prefix ?? '',
        convertToCSSVariables:
          opts.cssVarOptions?.convertToCSSVariables ??
          opts.mapOptions?.convertToCSSVariables ??
          false,
        includeFileNameToCSSVariables:
          opts.cssVarOptions?.includeFileNameToCSSVariables ??
          opts.mapOptions?.includeFileNameToCSSVariables ??
          false,
        excludeCSSVariables:
          opts.cssVarOptions?.excludeCSSVariables ?? opts.mapOptions?.excludeCSSVariables ?? [],
        useSeparateFile: opts.cssVarOptions?.useSeparateFile ?? false,
        fileNamePrefix: opts.cssVarOptions?.fileNamePrefix ?? '_runtime.',
      },

      builder: {
        format: 'json',
        outDir: opts.builder?.outDir ?? opts.source,
        paths: opts.builder?.paths ?? opts.paths ?? ['.'],
        includeRootDirName: opts.builder?.includeRootDirName ?? false,
        useTokensInSeparateFiles: opts.builder?.useTokensInSeparateFiles ?? true,
      },
    };

    const fallbackBuild = nodePath.resolve(process.cwd(), 'build');
    this.opts.build =
      typeof this.opts.build === 'string' && this.opts.build.trim().length > 0
        ? this.opts.build
        : fallbackBuild;

    this.parser = new SCSSParser(this);

    this.defaultParseOptions = {
      convertCase: false,
      convertPxToRem: false,
      convertToCSSVariables: false,
      includeFileName: false,
      ...opts.parseOptions,
    };

    this.defaultMapOptions = {
      ...this.defaultParseOptions,
      ...opts.mapOptions,
      prefix: opts.mapOptions?.prefix ?? '',
    };
  }

  private _normalizeIncludeServiceFields(raw?: IncludeServiceFields): {
    includeAll: boolean;
    set: Set<ServiceField>;
  } {
    if (raw === true) return { includeAll: true, set: new Set<ServiceField>() };
    if (raw === false || raw == null) return { includeAll: false, set: new Set<ServiceField>() };

    if (Array.isArray(raw)) {
      if (raw.includes('*') || raw.includes('all')) {
        return { includeAll: true, set: new Set<ServiceField>() };
      }
      if (raw.includes('none')) {
        return { includeAll: false, set: new Set<ServiceField>() };
      }
      if (raw.includes('core')) {
        return { includeAll: false, set: new Set<ServiceField>(['value', 'type', 'unit']) };
      }
      const valid: ServiceField[] = ['value', 'type', 'unit', 'meta', 'respond'];
      const set = new Set<ServiceField>(
        raw.filter((x): x is ServiceField => valid.includes(x as ServiceField)),
      );
      return { includeAll: false, set };
    }

    return { includeAll: false, set: new Set<ServiceField>() };
  }

  public resolveIncludeServiceFields(opts: ParseValueOptions): {
    includeAll: boolean;
    set: Set<ServiceField>;
  } {
    const local = this._normalizeIncludeServiceFields(opts.includeServiceFields);

    if (local.includeAll || local.set.size > 0) return local;

    const globalRaw = this.opts.mapOptions?.includeServiceFields;
    return this._normalizeIncludeServiceFields(globalRaw);
  }

  /* * * Universal getters for variable fields with $-aliasa support * * */

  public hasField(obj: any, name: string): boolean {
    if (obj == null) return false;
    return (
      Object.prototype.hasOwnProperty.call(obj, name) ||
      Object.prototype.hasOwnProperty.call(obj, `$${name}`)
    );
  }
  public getField<T = any>(obj: any, name: string): T | undefined {
    if (obj == null) return undefined;
    if (Object.prototype.hasOwnProperty.call(obj, name)) return obj[name] as T;
    if (Object.prototype.hasOwnProperty.call(obj, `$${name}`)) return obj[`$${name}`] as T;
    return undefined;
  }

  /* * * Unified accessors for alt keys * * */
  public hasTokenField(obj: any, name: 'value' | 'type' | 'unit' | 'meta'): boolean {
    return (
      Object.prototype.hasOwnProperty.call(obj, name) ||
      Object.prototype.hasOwnProperty.call(obj, `$${name}`)
    );
  }

  public getTokenField<T = any>(obj: any, name: 'value' | 'type' | 'unit' | 'meta'): T | undefined {
    if (obj == null) return undefined;
    if (Object.prototype.hasOwnProperty.call(obj, name)) return obj[name] as T;
    if (Object.prototype.hasOwnProperty.call(obj, `$${name}`)) return obj[`$${name}`] as T;
    return undefined;
  }

  async buildAndParse() {
    const builder = new JSONBuilder(this.opts.builder!);
    await builder.build();

    await this.ensureDirExists(this.opts.build);

    if (this.opts.source && this.opts.outDir) {
      await this.listDir(this.opts.source, this.opts.outDir);
    }

    await this.generateEntryFile();
    /* * * THEMES * * */
    if (this.opts.themesDir && this.opts.themesOutFile) {
      const includeRequired = this.opts.themesIncludeRequired ?? false;

      if (this.opts.themesDir.endsWith('.json')) {
        await this.generateThemesFromFile(
          this.opts.themesDir,
          this.opts.themesOutFile,
          includeRequired,
        );
      } else {
        await this.generateThemesFromDir(
          this.opts.themesDir,
          this.opts.themesOutFile,
          includeRequired,
        );
      }
    }
  }

  isKeyValidated(key: string): boolean {
    return /^[^$:].*/.test(key);
  }

  toKebabCase(key: string): string {
    return key
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
      .toLowerCase();
  }

  valuePxToRem(value: number): string {
    return `px2rem(${value}px)`;
  }

  convertNumberByKey(value: number, key?: string, opts?: ParseValueOptions): string {
    if (opts && Object.prototype.hasOwnProperty.call(opts, 'unit')) {
      const unitVal = (opts as any).unit;

      if (unitVal === '') {
        return `${value}`;
      }

      if (typeof unitVal === 'string') {
        return `${value}${unitVal}`;
      }
    }

    if (['font-size', 'line-height', 'letter-spacing'].includes(key || '')) {
      return `${value}em`;
    }

    return opts?.convertPxToRem ? this.valuePxToRem(value) : `${value}px`;
  }

  private async ensureDirExists(dir?: string) {
    if (!dir) return;
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {
      /* no-op */
    }
  }

  /* * * Color helpers * * */

  private normalizeUnit(u?: string): string {
    const unit = (u ?? '').trim().toLowerCase();
    if (unit === '' || unit === 'none' || unit === 'hex') return 'hex';
    if (unit === 'rgba') return 'rgba';
    if (unit === 'rgb') return 'rgb';
    if (unit === 'hsla') return 'hsla';
    if (unit === 'hsl') return 'hsl';
    if (unit === 'laba') return 'laba';
    if (unit === 'lab') return 'lab';
    if (unit === 'oklch' || unit === 'oklcha') return 'oklch';
    if (unit === 'oklab' || unit === 'oklaba') return 'oklab';
    return 'hex';
  }

  private formatColor(c: ReturnType<typeof Color>, unit?: string): string {
    const fmt = this.normalizeUnit(unit);
    const a = c.alpha();

    const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

    // Prepares helpers to convert a Color instance into OK* values.
    const rgbObj = () => c.rgb().object();
    const _okFromColor = () => {
      const { r, g, b } = rgbObj();
      const oklab = this.rgbToOKLab([r, g, b]); // Converts [0..255] RGB values into OKLab.
      const oklch = this.oklabToOklch(oklab); // Converts OKLab values into OKLCH.
      return { oklab, oklch };
    };

    if (fmt === 'oklch') {
      const { oklch } = _okFromColor();
      const [L, C, H] = oklch;
      const Lp = Math.round(L * 1000) / 1000;
      const Cp = Math.round(C * 1000) / 1000;
      const Hp = Math.round(H * 10) / 10;
      if (a >= 1) return `oklch(${Lp} ${Cp} ${Hp})`;
      const ap = Math.round(clamp(a) * 1000) / 1000;
      return `oklch(${Lp} ${Cp} ${Hp} / ${ap})`;
    }

    if (fmt === 'oklab') {
      const { oklab } = _okFromColor();
      const [L, A, B] = oklab;
      const Lp = Math.round(L * 1000) / 1000;
      const Ap = Math.round(A * 1000) / 1000;
      const Bp = Math.round(B * 1000) / 1000;
      if (a >= 1) return `oklab(${Lp} ${Ap} ${Bp})`;
      const ap = Math.round(clamp(a) * 1000) / 1000;
      return `oklab(${Lp} ${Ap} ${Bp} / ${ap})`;
    }

    if (fmt === 'hex') {
      return (a < 1 ? c.hexa() : c.hex()).toLowerCase();
    }

    if (fmt === 'rgb') {
      const { r, g, b } = c.rgb().object();
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    if (fmt === 'rgba') {
      const { r, g, b } = c.rgb().object();
      const alpha = Math.round(clamp(a) * 1000) / 1000;
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
    }

    if (fmt === 'hsl' || fmt === 'hsla') {
      const { h, s, l } = c.hsl().object();
      const hRound = Math.round(h ?? 0);
      const sRound = Math.round(s ?? 0);
      const lRound = Math.round(l ?? 0);
      if (fmt === 'hsl' || a >= 1) {
        return `hsl(${hRound} ${sRound}% ${lRound}%)`;
      }
      const alpha = Math.round(clamp(a) * 1000) / 1000;
      return `hsla(${hRound} ${sRound}% ${lRound}% / ${alpha})`;
    }

    if (fmt === 'lab' || fmt === 'laba') {
      const arr = (c as any).lab().array?.() ?? (c as any).lab().values ?? [];
      const [L, a1, b1] = arr;
      const Lr = Math.round((L ?? 0) * 10) / 10;
      const ar = Math.round((a1 ?? 0) * 10) / 10;
      const br = Math.round((b1 ?? 0) * 10) / 10;
      if (fmt === 'lab' || a >= 1) {
        return `lab(${Lr}% ${ar} ${br})`;
      }
      const alpha = Math.round(clamp(a) * 1000) / 1000;
      return `lab(${Lr}% ${ar} ${br} / ${alpha})`;
    }

    return (a < 1 ? c.hexa() : c.hex()).toLowerCase();
  }

  private parseAmount(raw: string): number {
    const s = raw.trim();
    if (s.endsWith('%')) {
      const p = parseFloat(s.slice(0, -1));
      if (!isNaN(p)) return p / 100;
    }
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }

  private tryToColor(raw: string): ReturnType<typeof Color> | null {
    try {
      return Color(raw);
    } catch {
      return null;
    }
  }

  /* * * Perceptual color math (OKLab/OKLCH) * * */

  // Low-level numeric helpers.
  private _clamp01(x: number) {
    return Math.max(0, Math.min(1, x));
  }
  private _lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }
  private _rad(deg: number) {
    return (deg * Math.PI) / 180;
  }
  private _deg(rad: number) {
    return (rad * 180) / Math.PI;
  }
  private _mod(a: number, n: number) {
    return ((a % n) + n) % n;
  }

  // sRGB and linear color space conversions.
  private _srgbToLinear(u: number) {
    const x = u / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }
  private _linearToSrgb(u: number) {
    const x = Math.max(0, Math.min(1, u));
    return x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  }

  // sRGB and OKLab conversions based on Björn Ottosson's reference implementation.
  private rgbToOKLab(rgb255: [number, number, number]): [number, number, number] {
    const [R8, G8, B8] = rgb255;
    const r = this._srgbToLinear(R8);
    const g = this._srgbToLinear(G8);
    const b = this._srgbToLinear(B8);

    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
    return [L, A, B];
  }

  private oklabToRgb(ok: [number, number, number]): [number, number, number] {
    const [L, A, B] = ok;
    const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
    const s_ = L - 0.0894841775 * A - 1.291485548 * B;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

    const R = Math.round(this._linearToSrgb(r) * 255);
    const G = Math.round(this._linearToSrgb(g) * 255);
    const Bc = Math.round(this._linearToSrgb(b) * 255);
    return [this._clampTo8(R), this._clampTo8(G), this._clampTo8(Bc)];
  }
  private _clampTo8(v: number) {
    return Math.max(0, Math.min(255, v | 0));
  }

  // OKLab and OKLCH conversion helpers.
  private oklabToOklch([L, A, B]: [number, number, number]): [number, number, number] {
    const C = Math.hypot(A, B);
    const H = this._mod(this._deg(Math.atan2(B, A)), 360);
    return [L, C, H];
  }
  private oklchToOklab([L, C, H]: [number, number, number]): [number, number, number] {
    const a = C * Math.cos(this._rad(H));
    const b = C * Math.sin(this._rad(H));
    return [L, a, b];
  }

  // Blends OKLCH colors along the shortest hue path.
  private mixOKLCH(aHex: string, bHex: string, t: number): string {
    const A = this.colorToOklch(aHex);
    const B = this.colorToOklch(bHex);
    const [La, Ca, Ha] = A;
    const [Lb, Cb, Hb] = B;

    // Ensures shortest-arc hue interpolation.
    let dH = Hb - Ha;
    if (dH > 180) dH -= 360;
    if (dH < -180) dH += 360;

    const L = this._lerp(La, Lb, t);
    const C = this._lerp(Ca, Cb, t);
    const H = Ha + dH * t;

    const rgb = this.oklabToRgb(this.oklchToOklab([L, C, this._mod(H, 360)]));
    return Color.rgb(rgb[0], rgb[1], rgb[2]).hex().toLowerCase();
  }

  private colorToOklch(colorStr: string): [number, number, number] {
    const col = this.tryToColor(colorStr);
    if (!col) return [0, 0, 0];
    const { r, g, b } = col.rgb().object();
    return this.oklabToOklch(this.rgbToOKLab([r, g, b]));
  }

  // Adjusts OKLCH lightness by a relative delta.
  private relShiftLOKLCH(colorStr: string, deltaL: number): string {
    const [L, C, H] = this.colorToOklch(colorStr);
    const L2 = this._clamp01(L - deltaL); // Darkening subtracts the delta; pass a negative delta to lighten.
    const rgb = this.oklabToRgb(this.oklchToOklab([L2, C, H]));
    return Color.rgb(rgb[0], rgb[1], rgb[2]).hex().toLowerCase();
  }

  // Parses oklch()/oklab() literals and returns sRGB hex values.
  private parseOKStringToHex(raw: string): string | null {
    // Accepts oklch(L C H [/ A]) or oklab(L A B [/ A]) syntaxes.
    const s = raw.trim().toLowerCase();
    const okLCH = /^oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([\-0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)$/;
    const okLAB = /^oklab\(\s*([0-9.]+)\s+([\-0-9.]+)\s+([\-0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)$/;

    let m = okLCH.exec(s);
    if (m) {
      const L = parseFloat(m[1]);
      const C = parseFloat(m[2]);
      const H = parseFloat(m[3]);
      const [R, G, B] = this.oklabToRgb(this.oklchToOklab([L, C, H]));
      const base = Color.rgb(R, G, B);
      const a = m[4] != null ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 1;
      return (a < 1 ? base.alpha(a).hexa() : base.hex()).toLowerCase();
    }
    m = okLAB.exec(s);
    if (m) {
      const L = parseFloat(m[1]);
      const A = parseFloat(m[2]);
      const B = parseFloat(m[3]);
      const [R, G, Bc] = this.oklabToRgb([L, A, B]);
      const base = Color.rgb(R, G, Bc);
      const a = m[4] != null ? Math.max(0, Math.min(1, parseFloat(m[4]))) : 1;
      return (a < 1 ? base.alpha(a).hexa() : base.hex()).toLowerCase();
    }
    return null;
  }

  // Computes relative luminance in sRGB for WCAG contrast.
  private _relLuminance(rgb255: [number, number, number]) {
    const [r8, g8, b8] = rgb255;
    const rl = this._srgbToLinear(r8);
    const gl = this._srgbToLinear(g8);
    const bl = this._srgbToLinear(b8);
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
  }
  public contrastRatio(fg: string, bg: string): number {
    const f = this.tryToColor(fg),
      b = this.tryToColor(bg);
    if (!f || !b) return 1;
    const frgb = f.rgb().array() as [number, number, number];
    const brgb = b.rgb().array() as [number, number, number];
    const L1 = this._relLuminance(frgb);
    const L2 = this._relLuminance(brgb);
    const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
    return (hi + 0.05) / (lo + 0.05);
  }

  // Picks the most readable foreground color and optionally adjusts lightness in OKLCH.
  public pickReadable(fg1: string, fg2: string, bg: string, target = 4.5): string {
    if (this.contrastRatio(fg1, bg) >= target) return fg1;
    if (this.contrastRatio(fg2, bg) >= target) return fg2;
    // Attempts to adjust the first foreground lightness slightly (±0.12).
    const [L, C, H] = this.colorToOklch(fg1);
    // Chooses the direction that yields higher contrast.
    const up = this.contrastRatio(this.oklchToHex([this._clamp01(L + 0.12), C, H]), bg);
    const dn = this.contrastRatio(this.oklchToHex([this._clamp01(L - 0.12), C, H]), bg);
    const dir = up >= dn ? +1 : -1;
    let best = fg1,
      bestC = this.contrastRatio(fg1, bg);
    for (let i = 1; i <= 12; i++) {
      const L2 = this._clamp01(L + dir * (i * 0.01));
      const cand = this.oklchToHex([L2, C, H]);
      const c = this.contrastRatio(cand, bg);
      if (c > bestC) {
        best = cand;
        bestC = c;
        if (c >= target) break;
      }
    }
    return best;
  }
  private oklchToHex([L, C, H]: [number, number, number]): string {
    const rgb = this.oklabToRgb(this.oklchToOklab([L, C, H]));
    return Color.rgb(rgb[0], rgb[1], rgb[2]).hex().toLowerCase();
  }
  /* * * END Perceptual color math (OKLab/OKLCH) * * */

  /**
   * Color expression evaluator.
   * Supports: rgba(color, a), lighten(color, x), darken(color, x), saturate(color, x), desaturate(color, x)
   * `color` can be: a color string, a {link}, or a nested function.
   * IMPORTANT: returns a Color object (not formatted). Formatting happens in tryParseColor().
   */
  private evaluateColorExpression(expr: string): ReturnType<typeof Color> | null {
    let s = expr.trim();

    // Tries to interpret the expression as a plain color.
    const plain = this.tryToColor(s);
    if (plain) return plain;

    // Attempts to interpret the expression as a function call.
    const fnMatch = /^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/.exec(s);
    if (!fnMatch) {
      // Allows raw oklch()/oklab() literals.
      const okHex = this.parseOKStringToHex(s);
      if (okHex) return this.tryToColor(okHex);
      return null;
    }

    const fn = fnMatch[1].toLowerCase();
    const argsStr = fnMatch[2];

    // Splits arguments by commas while respecting nested parentheses.
    const args: string[] = [];
    let buf = '';
    let depth = 0;
    for (let i = 0; i < argsStr.length; i++) {
      const ch = argsStr[i];
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        args.push(buf.trim());
        buf = '';
      } else {
        buf += ch;
      }
    }
    if (buf.trim().length) args.push(buf.trim());

    const resolveColorArg = (arg: string): ReturnType<typeof Color> | null => {
      const resolved = arg.startsWith('{')
        ? this.parseNestedValue(arg, this.defaultParseOptions)
        : arg;

      // Allows raw oklch()/oklab() literals.
      const okHex = this.parseOKStringToHex(String(resolved));
      if (okHex) return this.tryToColor(okHex);
      return this.tryToColor(String(resolved).trim());
    };

    const resolveMaybeFunction = (arg: string): ReturnType<typeof Color> | null => {
      const direct = resolveColorArg(arg);
      if (direct) return direct;
      const inner = this.evaluateColorExpression(arg);
      if (inner) return inner;
      return null;
    };

    let out: ReturnType<typeof Color> | null = null;

    switch (fn) {
      case 'rgba': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const alpha = this.parseAmount(args[1]);
        out = base.alpha(alpha);
        break;
      }
      case 'lighten': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = this.parseAmount(args[1]);
        out = base.lighten(amt);
        break;
      }
      case 'darken': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = this.parseAmount(args[1]);
        out = base.darken(amt);
        break;
      }
      case 'lightness': {
        // Handles lightness(color, amount).
        // Positive amounts lighten and negative amounts darken.
        if (args.length !== 2) return null;

        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;

        // Supports numeric or percentage strings such as "0.1" or "10%".
        const amt = this.parseAmount(args[1]);
        if (amt === 0) return base;

        // Uses Color.js lighten/darken (HSL-based) to maintain parity with existing functions.
        return amt > 0 ? base.lighten(amt) : base.darken(-amt);
      }
      case 'saturate': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = this.parseAmount(args[1]);
        out = base.saturate(amt);
        break;
      }
      case 'desaturate': {
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = this.parseAmount(args[1]);
        out = base.desaturate(amt);
        break;
      }

      /* * * [ADDED OK*] new perceptual functions * * */
      case 'oklch': {
        // Handles oklch(L C H [/ A]).
        if (args.length < 3 || args.length > 4) return null;
        const raw = `oklch(${args.join(',')})`.replace(/,/g, ' ');
        const hex = this.parseOKStringToHex(raw);
        return hex ? this.tryToColor(hex) : null;
      }
      case 'oklab': {
        // Handles oklab(L A B [/ A]).
        if (args.length < 3 || args.length > 4) return null;
        const raw = `oklab(${args.join(',')})`.replace(/,/g, ' ');
        const hex = this.parseOKStringToHex(raw);
        return hex ? this.tryToColor(hex) : null;
      }
      case 'rel_darken_oklch': {
        // Handles rel_darken_oklch(color, amount).
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = this.parseAmount(args[1]); // Normalizes values to the 0..1 range.
        const hex = this.relShiftLOKLCH(base.hex().toString(), +amt); // Applies subtraction internally.
        return this.tryToColor(hex);
      }
      case 'rel_lighten_oklch': {
        // Handles rel_lighten_oklch(color, amount) by negating the delta.
        if (args.length !== 2) return null;
        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;
        const amt = this.parseAmount(args[1]);
        const hex = this.relShiftLOKLCH(base.hex().toString(), -amt);
        return this.tryToColor(hex);
      }
      case 'shift_oklch': {
        // Handles shift_oklch(color, dL).
        // Negative dL values darken and positive values lighten.
        if (args.length !== 2) return null;

        const base = resolveMaybeFunction(args[0]);
        if (!base) return null;

        // Accepts numeric or percentage offsets such as -0.05 or -5%.
        const dL = this.parseAmount(args[1]);

        const [L, C, H] = this.colorToOklch(base.hex().toString());
        const L2 = this._clamp01(L + dL);

        const hex = this.oklchToHex([L2, C, H]);
        return this.tryToColor(hex);
      }
      case 'mix_oklch': {
        // Handles mix_oklch(colorA, colorB, t).
        if (args.length !== 3) return null;
        const A = resolveMaybeFunction(args[0]);
        const B = resolveMaybeFunction(args[1]);
        if (!A || !B) return null;
        const t = this.parseAmount(args[2]); // Supports values between 0 and 1 or percentage strings.
        const hex = this.mixOKLCH(
          A.hex().toString(),
          B.hex().toString(),
          Math.max(0, Math.min(1, t)),
        );
        return this.tryToColor(hex);
      }
      case 'on_contrast': {
        // Handles on_contrast(fg1, fg2, bg[, target]).
        if (args.length < 3 || args.length > 4) return null;
        const FG1 = resolveMaybeFunction(args[0]);
        if (!FG1) return null;
        const FG2 = resolveMaybeFunction(args[1]);
        if (!FG2) return null;
        const BG = resolveMaybeFunction(args[2]);
        if (!BG) return null;
        const target = args[3] != null ? parseFloat(args[3]) : 4.5;
        const chosen = this.pickReadable(
          FG1.hex().toString(),
          FG2.hex().toString(),
          BG.hex().toString(),
          target,
        );
        return this.tryToColor(chosen);
      }
      default:
        return null;
    }

    return out;
  }

  /**
   * Public helper: evaluate a string as a color/color expression and return it
   * formatted according to `unitForFormat`. If it's not a color, return null.
   */
  public tryParseColor(value: string, unitForFormat?: string): string | null {
    const raw = value.trim();

    // Allows raw oklch()/oklab() literals directly.
    const okHex = this.parseOKStringToHex(raw);
    if (okHex) return this.formatColor(Color(okHex), unitForFormat);

    // 1. Resolve a leading single {ref}, if any.
    const resolved = raw.startsWith('{')
      ? String(this.parseNestedValue(raw, this.defaultParseOptions))
      : raw;

    // 2. Try parsing as a direct color.
    const direct = this.tryToColor(resolved);
    if (direct) return this.formatColor(direct, unitForFormat);

    // 3. Try parsing as a color expression (returns Color), then format.
    const exprColor = this.evaluateColorExpression(resolved);
    if (exprColor) return this.formatColor(exprColor, unitForFormat);

    // 4. If there are embedded references, resolve them and try again.
    if (/\{[^}]+\}/.test(resolved)) {
      const withRefsResolved = resolved.replace(/\{[^}]+\}/g, (m) =>
        String(this.parseNestedValue(m, this.defaultParseOptions)),
      );

      const direct2 = this.tryToColor(withRefsResolved);
      if (direct2) return this.formatColor(direct2, unitForFormat);

      const exprColor2 = this.evaluateColorExpression(withRefsResolved);
      if (exprColor2) return this.formatColor(exprColor2, unitForFormat);
    }

    return null;
  }

  /* * * end of color helpers * * */

  private normalizeValue(
    value: any,
    opts: ParseValueOptions,
    _depth: number = 0,
    _trail: string[] = [],
  ): string {
    const depth = _depth | 0;
    if (depth > 100) {
      if (this.opts.verbose) {
        console.warn(
          `⚠️ [normalizeValue] depth limit reached (>${depth}) in file "${opts.fileName ?? ''}". Value preview: ${String(value).slice(0, 120)}…`,
        );
      }
      return String(value);
    }

    // Handles nested token references such as "{file.key}".
    if (_.isString(value) && value.startsWith('{')) {
      const before = value;
      const nested = this.parseNestedValue(value, opts);
      if (nested === before) {
        if (this.opts.verbose) {
          console.warn(
            `⚠️ [normalizeValue] no-progress after parseNestedValue in file "${opts.fileName ?? ''}". Ref: ${before}`,
          );
        }
        return before;
      }
      return this.normalizeValue(nested, opts, depth + 1, _trail);
    }

    if (typeof value === 'number') {
      return this.convertNumberByKey(value, opts.key, opts);
    }

    if (typeof value === 'string') {
      // Attempts to parse a color first.
      const colorMaybe = this.tryParseColor(value, opts.unit);
      if (colorMaybe) return colorMaybe;

      if (/^\d+(\.\d+)?$/.test(value)) {
        return this.convertNumberByKey(Number(value), opts.key, opts);
      }
      if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) {
        return value;
      }
      return value;
    }

    if (_.isArray(value)) {
      return value.map((v) => this.normalizeValue(v, opts, depth + 1, _trail)).join(' ');
    }

    if (_.isPlainObject(value)) {
      if (this.hasTokenField(value, 'value')) {
        const localOpts: ParseValueOptions = {
          ...opts,
          key:
            typeof this.getTokenField(value, 'type') === 'string'
              ? (this.getTokenField(value, 'type') as string)
              : opts.key,
          unit: (() => {
            const hasUnit = this.hasTokenField(value, 'unit');
            const unitVal = this.getTokenField(value, 'unit');
            return hasUnit && typeof unitVal === 'string' ? unitVal : opts.unit;
          })(),
        };
        return this.normalizeValue(
          this.getTokenField(value, 'value'),
          localOpts,
          depth + 1,
          _trail,
        );
      }

      // Delegates plain-object parsing to the active parser implementation.
      return (this.parser as Parser).parseMap(value as IMap, opts);
    }

    return String(value);
  }

  /**
   * Synchronous parsing of nested references "{file.path.to.token}" with a
   * fallback folder-structure lookup when the file is not found and the flag
   * `useFileStructureLookup` is enabled.
   */
  parseNestedValue(
    value: string,
    opts: ParseValueOptions,
    depth = 0,
    visited = new Set<string>(),
  ): any {
    if (depth > 50) {
      if (this.opts.verbose) {
        console.warn(
          `⚠️ [parseNestedValue] depth limit reached in file "${opts.fileName ?? ''}" at value: ${value.slice(0, 120)}…`,
        );
      }
      return value;
    }

    const regex = /{([^}]+)}/g;
    let result = value;
    let match: RegExpExecArray | null;
    let madeAnyReplacement = false;

    const localSeen = new Set<string>();

    while ((match = regex.exec(result)) !== null) {
      const fullMatch = match[0];
      const pathStr = match[1];

      if (localSeen.has(pathStr)) {
        if (this.opts.verbose) {
          console.warn(
            `⚠️ [parseNestedValue] repeated ref "{${pathStr}}" within same value in "${opts.fileName ?? ''}" — possible cycle.`,
          );
        }
        continue;
      }
      localSeen.add(pathStr);

      if (visited.has(pathStr)) {
        if (this.opts.verbose) {
          console.warn(
            `⚠️ [parseNestedValue] circular reference detected: {${pathStr}} (file "${opts.fileName ?? ''}")`,
          );
        }
        continue;
      }

      visited.add(pathStr);

      const pathParts = pathStr.split('.');
      const fileName = pathParts.shift();

      if (!fileName) {
        visited.delete(pathStr);
        continue;
      }

      if (this.opts.verbose) {
        console.warn(
          `ℹ️ [parseNestedValue] resolving {${pathStr}} (from "${opts.fileName ?? ''}")`,
        );
      }

      let json: any;
      let fileFound = false;

      if (this.fileCache[fileName]) {
        json = this.fileCache[fileName];
        fileFound = true;
      } else {
        const paths = this.opts.paths ?? ['.'];
        for (const p of paths) {
          const filePath = `${p}/${fileName}.json`;
          try {
            json = JSON.parse(readFileSync(filePath, 'utf-8'));
            this.fileCache[fileName] = json;
            fileFound = true;
            break;
          } catch {
            // Try the next path.
          }
        }
      }

      if (!fileFound && this.opts.useFileStructureLookup) {
        const resolved = this.resolveTokenPathRecursiveSync(pathStr);
        if (resolved !== undefined) {
          result = result.replace(fullMatch, resolved as any);
          madeAnyReplacement = true;
          visited.delete(pathStr);
          continue;
        }
      }

      if (!fileFound) {
        if (this.opts.verbose) {
          console.warn(
            `⚠️ [parseNestedValue] file "${fileName}.json" not found while resolving {${pathStr}} (paths: ${(this.opts.paths ?? ['.']).join(', ')})`,
          );
        }
        visited.delete(pathStr);
        continue;
      }

      let nestedValue = pathParts.reduce((acc, key) => acc?.[key], json);
      if (nestedValue === undefined) {
        if (this.opts.verbose) {
          console.warn(
            `⚠️ [parseNestedValue] path "${pathStr}" not found inside "${fileName}.json"`,
          );
        }
        visited.delete(pathStr);
        continue;
      }

      if (typeof nestedValue === 'string' && nestedValue.startsWith('{')) {
        nestedValue = this.parseNestedValue(nestedValue, opts, depth + 1, visited);
      }

      result = result.replace(fullMatch, nestedValue);
      madeAnyReplacement = true;
      visited.delete(pathStr);
    }

    if (!madeAnyReplacement && this.opts.verbose) {
      console.warn(
        `⚠️ [parseNestedValue] no matches/replacements in "${opts.fileName ?? ''}" for: ${value}`,
      );
    }

    return result;
  }

  /* * * Theming * * */

  async writeCSSFile(filePath: string, cssContent: string) {
    await fs.mkdir(nodePath.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, cssContent, 'utf-8');
  }

  async generateThemesFromDir(
    inputDir: string,
    outputPath: string,
    includeRequired: boolean,
  ): Promise<void> {
    const files = await fs.readdir(inputDir);
    const themes: Record<string, any> = {};

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const themeName = nodePath.basename(file, '.json');
      const raw = await fs.readFile(nodePath.join(inputDir, file), 'utf-8');
      themes[themeName] = JSON.parse(raw);
    }

    const css = this.generateThemesBlockFromObject(themes, includeRequired);
    await fs.mkdir(nodePath.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, css, 'utf-8');
  }

  async generateThemesFromFile(
    inputPath: string,
    outputPath: string,
    includeRequired: boolean,
  ): Promise<void> {
    const raw = await fs.readFile(inputPath, 'utf-8');
    const themes = JSON.parse(raw);

    const css = this.generateThemesBlockFromObject(themes, includeRequired);
    await fs.mkdir(nodePath.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, css, 'utf-8');
  }

  generateThemesBlockFromObject(themes: Record<string, any>, includeRequired: boolean): string {
    // Serializes a single theme object into an array of CSS variable declarations.
    const collectVarsFromTheme = (themeObj: any, prefixPath: string[] = []) => {
      const vars: string[] = [];

      const walk = (obj: any, path: string[] = []) => {
        if (_.isPlainObject(obj) && this.hasTokenField(obj, 'value')) {
          const meta = this.getTokenField(obj, 'meta');
          const exportAsVar = meta?.build?.web?.exportAsVar ?? false;

          if (!includeRequired || exportAsVar) {
            const pathName = [...prefixPath, ...path].join('-');
            const pfx =
              (this.opts.mapOptions?.prefix && this.opts.mapOptions?.prefix !== ''
                ? this.opts.mapOptions?.prefix
                : undefined) ??
              (this.opts.cssVarOptions?.prefix && this.opts.cssVarOptions?.prefix !== ''
                ? this.opts.cssVarOptions?.prefix
                : undefined) ??
              '';
            const cssVarName = pfx ? `--${pfx}-${pathName}` : `--${pathName}`;
            const rawVal = this.getTokenField(obj, 'value');
            vars.push(
              `${cssVarName}: ${(this.parser.parseValue as any)(rawVal, this.defaultParseOptions)}`,
            );
          }
          return;
        }

        if (_.isPlainObject(obj)) {
          for (const [k, v] of Object.entries(obj)) {
            walk(v, [...path, this.toKebabCase(k)]);
          }
        }
      };

      walk(themeObj);
      return vars;
    };

    let css = '';

    // Unwraps a single-level wrapper when needed while preserving the original parameter.
    let localThemes: Record<string, any> = themes;
    const rootKeys = Object.keys(localThemes);
    if (rootKeys.length === 1) {
      const onlyKey = rootKeys[0];
      const onlyVal = localThemes[onlyKey];
      if (
        _.isPlainObject(onlyVal) &&
        Object.keys(onlyVal).length > 0 &&
        Object.values(onlyVal).every((v) => _.isPlainObject(v))
      ) {
        localThemes = onlyVal as Record<string, any>;
      }
    }

    for (const [rawThemeName, themeObj] of Object.entries(localThemes)) {
      if (!_.isPlainObject(themeObj)) continue;

      const themeName = this.toKebabCase(rawThemeName);
      const vars = collectVarsFromTheme(themeObj);
      if (vars.length === 0) continue;

      css += `\n[data-theme="${themeName}"] {\n  ${vars.join('\n  ')}\n}\n`;
    }

    return css;
  }

  /* * * JSONToSCSS * * */
  async JSONToSCSS(
    inputPath: string,
    outputDir: string,
    outputFileName: string,
    opts?: Partial<JSONToSCSSOptions>,
  ): Promise<void> {
    const {
      header = '// Generated by tokensParser. ‼️ DO NOT MODIFY THIS FILE ‼️ /\n',
      name = '',
      comment = '',
      options,
      mapOptions,
    } = { ...(opts || {}) } as JSONToSCSSOptions;

    const baseOptions: ParseValueOptions = {
      ...this.defaultParseOptions,
      fileName: options?.fileName || '',
      ...(options || {}),
    };

    const parseMapOptions: ParseValueOptions = {
      ...baseOptions,
      ...(mapOptions || {}),
    };

    const outputPath = `${outputDir}/${outputFileName}`;

    try {
      const isOutputExists = await fs
        .access(outputDir)
        .then(() => true)
        .catch(() => false);
      if (!isOutputExists) await fs.mkdir(outputDir, { recursive: true });

      const data = await fs.readFile(inputPath, 'utf-8');
      const json = JSON.parse(data);

      let content = `${header}\n${comment}\n`;

      const topLevelKey =
        parseMapOptions.includeFileName && parseMapOptions.fileName
          ? parseMapOptions.convertCase
            ? this.toKebabCase(parseMapOptions.fileName)
            : parseMapOptions.fileName
          : '';

      const rootMap =
        parseMapOptions.includeFileName && parseMapOptions.fileName
          ? { [topLevelKey]: json }
          : json;

      const scssParser = this.parser instanceof SCSSParser ? this.parser : null;

      // Clears collected CSS variables to avoid duplicates across files.
      scssParser?.clearCssVars();

      // Generates SCSS maps.
      for (const [k, v] of Object.entries(rootMap)) {
        const kebabKey = parseMapOptions.convertCase ? this.toKebabCase(k) : k;
        const keyLine = `$${kebabKey}:`;
        const map = v as IMap;

        // Preserves prefixes by seeding the initial path with the current key.
        const initialPath =
          kebabKey && kebabKey.length > 0
            ? [kebabKey]
            : parseMapOptions.fileName
              ? [
                  parseMapOptions.convertCase
                    ? this.toKebabCase(parseMapOptions.fileName)
                    : parseMapOptions.fileName,
                ]
              : [];

        const mapStr = this.parser.parseMap(map, parseMapOptions, initialPath);
        const useDefault =
          (parseMapOptions.scssUseDefaultFlag ??
            this.opts.mapOptions?.scssUseDefaultFlag ??
            true) === true;

        const str = `${keyLine}${mapStr}${useDefault ? ' !default' : ''};`;
        content += `${str}\n`;
      }

      // Appends CSS variables collected during map parsing.
      if (scssParser) {
        const cssVarsBlock = scssParser.getCssVarsBlock();
        if (cssVarsBlock) {
          const cssOpts = this.opts.cssVarOptions ?? {};
          const useSeparate = cssOpts.useSeparateFile ?? false;

          if (useSeparate) {
            const prefix = cssOpts.fileNamePrefix ?? '__';
            const baseName =
              parseMapOptions.fileName || outputFileName.replace(/^_/, '').replace(/\.scss$/, '');
            const cssFileName = `${prefix}${baseName}.css`;

            const cssOutDir = this.opts.cssVarsOutDir || outputDir;
            const cssOutPath = `${cssOutDir}/${cssFileName}`;

            await fs.mkdir(cssOutDir, { recursive: true });
            await fs.writeFile(cssOutPath, cssVarsBlock.trimStart());
            console.log(`CSS variables written to ${cssOutPath}`);
          } else {
            content += cssVarsBlock;
          }
        }
      }

      // Writes the SCSS output file.
      await fs.writeFile(outputPath, content);
      console.log(`${name} parsed to ${outputPath}`);
    } catch (err) {
      console.error(err);
    }
  }

  /* * * listDir * * */
  private async listDir(source: string, output: string) {
    try {
      await this.ensureDirExists(this.opts.build);

      const fileNames = await fs.readdir(source);
      for (const fileName of fileNames) {
        if (/^(?=.).*.json$/.test(fileName)) {
          await this.resolveAndSaveJson(`${source}/${fileName}`, fileName);

          if (!this.opts.build) continue;
          await this.JSONToSCSS(
            `${this.opts.build}/${fileName}`,
            `${output}`,
            `_${fileName.replace('.json', '.scss')}`,
            {
              options: {
                ...this.defaultParseOptions,
                fileName: fileName.replace(/\.json$/, ''),
              },
              mapOptions: this.defaultMapOptions,
              name: fileName.replace('.json', ''),
            },
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async resolveAndSaveJson(inputPath: string, fileName: string): Promise<void> {
    if (!this.opts.build) return;
    const unresolvedTokens: string[] = [];
    try {
      const jsonRaw = await fs.readFile(inputPath, 'utf-8');
      const json = JSON.parse(jsonRaw);

      const resolveRecursive = (obj: any, opts: ParseValueOptions, depth = 0): any => {
        if (_.isString(obj)) {
          const regex = /{([^}]+)}/g;
          let result: any = obj;
          let match: RegExpExecArray | null;
          while ((match = regex.exec(obj)) !== null) {
            const fullMatch = match[0];
            const pathStr = match[1];
            const pathParts = pathStr.split('.');
            const fName = pathParts.shift();
            if (!fName) continue;

            try {
              let jsonFile: any;

              if (this.fileCache[fName]) {
                jsonFile = this.fileCache[fName];
              } else {
                const paths = this.opts.paths ?? ['.'];
                let fileFound = false;

                for (const p of paths) {
                  const filePath = `${p}/${fName}.json`;
                  try {
                    const file = readFileSync(filePath, 'utf-8');
                    jsonFile = JSON.parse(file);
                    this.fileCache[fName] = jsonFile;
                    fileFound = true;
                    break;
                  } catch {
                    continue;
                  }
                }

                if (!fileFound && this.opts.useFileStructureLookup) {
                  const resolved = this.resolveTokenPathRecursiveSync(pathStr);
                  if (resolved !== undefined) {
                    result = result.replace(fullMatch, resolved as any);
                    continue;
                  }
                }

                if (!fileFound) {
                  unresolvedTokens.push(fullMatch);
                  continue;
                }
              }

              let nestedValue = pathParts.reduce((acc, key) => acc?.[key], jsonFile);
              if (nestedValue === undefined) {
                if (this.opts.useFileStructureLookup) {
                  const resolved = this.resolveTokenPathRecursiveSync(pathStr);
                  if (resolved !== undefined) {
                    result = result.replace(fullMatch, resolved as any);
                    continue;
                  }
                }
                unresolvedTokens.push(fullMatch);
                continue;
              }

              nestedValue = resolveRecursive(nestedValue, opts, depth + 1);
              if (obj === fullMatch) return nestedValue;

              result = result.replace(fullMatch, nestedValue);
            } catch {
              unresolvedTokens.push(fullMatch);
            }
          }

          // Normalizes resolved color expressions using the parent options.
          const colorMaybe = this.tryParseColor(String(result), opts.unit);
          return colorMaybe ?? result;
        }

        if (_.isArray(obj)) return obj.map((v) => resolveRecursive(v, opts, depth));
        if (_.isPlainObject(obj))
          return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, resolveRecursive(v, opts, depth)]),
          );
        return obj;
      };

      const resolvedJson = resolveRecursive(json, {
        ...this.defaultParseOptions,
        fileName: fileName.replace(/\.json$/, ''),
      });

      const buildDir = this.opts.build!;
      await this.ensureDirExists(buildDir);

      const exists = await fs
        .access(buildDir)
        .then(() => true)
        .catch(() => false);
      if (!exists) await fs.mkdir(buildDir, { recursive: true });
      const buildPath = `${buildDir}/${fileName}`;
      await fs.writeFile(buildPath, JSON.stringify(resolvedJson, null, 2), 'utf-8');

      if (unresolvedTokens.length > 0) {
        const logPath = `${buildDir}/unresolved-tokens.log`;
        const uniqueTokens = [...new Set(unresolvedTokens)];
        await fs.writeFile(logPath, uniqueTokens.join('\n'), 'utf-8');
        if (this.opts.verbose) console.warn('Unresolved tokens saved to', logPath);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async generateEntryFile() {
    const { build, entryFilePath } = this.opts;
    if (!build || !entryFilePath) return;

    try {
      await this.ensureDirExists(build);
      const entryDir = nodePath.dirname(entryFilePath);
      await this.ensureDirExists(entryDir);

      const exists = await fs
        .access(build)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        await fs.mkdir(build, { recursive: true });
      }

      const files = await fs.readdir(build).catch(() => []);
      const jsonFiles = (files || []).filter((f: string) => f.endsWith('.json')).sort();
      const moduleKeys = jsonFiles.map((file: string) => file.replace('.json', ''));

      if (jsonFiles.length === 0) {
        const emptyContent = `export default {};\n`;
        await fs.writeFile(entryFilePath, emptyContent, 'utf-8');
        console.log(`ℹ️ No JSON files in "${build}". Empty entry generated at ${entryFilePath}`);
        return;
      }

      const relativeImportPath = nodePath.relative(nodePath.dirname(entryFilePath), build);

      const imports = jsonFiles
        .map((file: string) => {
          const name = file.replace('.json', '');
          let importPath = nodePath.join(relativeImportPath, file).replace(/\\/g, '/');
          if (!importPath.startsWith('.') && !importPath.startsWith('/'))
            importPath = './' + importPath;
          return `import ${name} from "${importPath}";`;
        })
        .join('\n');

      const moduleBody = this.opts.isModulesMergedIntoEntry
        ? moduleKeys.join(',\n  ')
        : moduleKeys.map((name) => `...${name}`).join(',\n  ');

      const content = `${imports}

const module = {
  ${moduleBody}
};

export default module;
`;

      await fs.writeFile(entryFilePath, content, 'utf-8');
      console.log(`✅ TypeScript entry file generated at ${entryFilePath}`);
    } catch (err) {
      console.error('❌ Failed to generate TypeScript entry file', err);
    }
  }

  /* * * File helpers (sync) for folder-structure lookup * * */

  private isFileSync(p: string): boolean {
    try {
      return statSync(p).isFile();
    } catch {
      return false;
    }
  }

  private isDirSync(p: string): boolean {
    try {
      return statSync(p).isDirectory();
    } catch {
      return false;
    }
  }

  private getNestedValue(obj: any, keys: string[]): any {
    return keys.reduce((acc, k) => acc?.[k], obj);
  }

  /**
   * SYNCHRONOUS token lookup by folder structure.
   * Example: "themes.light.surface.neutral.primary" will try:
   *   <root>/themes.json -> .light.surface.neutral.primary
   *   <root>/themes/light.json -> .surface.neutral.primary
   *   <root>/themes/light/surface.json -> .neutral.primary
   *   <root>/themes/light/surface/neutral.json -> .primary
   * ...across all roots in this.opts.paths.
   */
  private resolveTokenPathRecursiveSync(pathStr: string): any {
    const parts = pathStr.split('.');

    const tryResolve = (currentParts: string[], currentDir: string): any => {
      if (currentParts.length === 0) return undefined;

      // 1. Try "<currentDir>/<head>.json".
      const head = currentParts[0];
      const filePath = nodePath.join(currentDir, `${head}.json`);
      if (this.isFileSync(filePath)) {
        try {
          const content = JSON.parse(readFileSync(filePath, 'utf-8'));
          if (currentParts.length === 1) return content;
          return this.getNestedValue(content, currentParts.slice(1));
        } catch {
          // Ignores parsing errors and continues.
        }
      }

      // 2. Try "<currentDir>/<head>/..." as a directory.
      const dirPath = nodePath.join(currentDir, head);
      if (this.isDirSync(dirPath)) {
        const res = tryResolve(currentParts.slice(1), dirPath);
        if (res !== undefined) return res;
      }

      // 3. Join several segments into one file during a gradient search.
      for (let i = currentParts.length; i > 0; i--) {
        const joined = currentParts.slice(0, i).join('/');
        const joinedFile = nodePath.join(currentDir, `${joined}.json`);
        if (this.isFileSync(joinedFile)) {
          try {
            const content = JSON.parse(readFileSync(joinedFile, 'utf-8'));
            return this.getNestedValue(content, currentParts.slice(i));
          } catch {
            // Ignores parsing errors and continues.
          }
        }
      }

      return undefined;
    };

    for (const root of this.opts.paths ?? ['./']) {
      const abs = nodePath.resolve(root);
      const res = tryResolve(parts, abs);
      if (res !== undefined) return res;
    }

    return undefined;
  }
}
