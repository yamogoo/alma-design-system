// Portions of this file were developed with the assistance of AI tools (ChatGPT).

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

export interface ParseValueOptions {
  convertPxToRem: boolean;
  convertCase?: boolean;
  includeFileName?: boolean;
  convertToCSSVariables?: boolean;
  includeFileNameToCSSVariables?: boolean;
  excludeCSSVariables?: string[];
  fileName?: string;
  key?: string;
  unit?: string;
}

export interface JSONToSCSSOptions {
  name: string;
  header: string;
  comment: string;
  options: Partial<ParseValueOptions>;
  mapOptions?: Partial<ParseValueOptions>;
  varsOptions?: Partial<ParseValueOptions>;
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
  varsOptions?: Partial<ParseValueOptions>;
  parseOptions?: Partial<ParseValueOptions>;
  useFileStructureLookup?: boolean; // enable folder-structure lookup for token refs
  useReflectOriginalStructure?: boolean;
  themesDir?: string;
  themesOutFile?: string; // scss
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
  // Map: varName -> value for deduplication and predictable overrides
  private collectedCssVars: Map<string, string> = new Map();

  constructor(tokensParser: TokensParser) {
    super();
    this.tokensParser = tokensParser;
  }

  // PUBLIC: clear accumulated CSS variables (to avoid duplication between files)
  public clearCssVars() {
    this.collectedCssVars.clear();
  }

  private normalizeValue(value: any, opts: ParseValueOptions): string {
    // nested token reference like "{file.key}"
    if (_.isString(value) && value.startsWith('{')) {
      const nested = this.tokensParser.parseNestedValue(value, opts);
      return this.normalizeValue(nested, opts);
    }

    if (typeof value === 'number') {
      return this.tokensParser.convertNumberByKey(value, opts.key, opts);
    }

    if (typeof value === 'string') {
      // try to recognize a color/color expression and format to requested unit
      const colorMaybe = this.tokensParser.tryParseColor(value, opts.unit);
      if (colorMaybe) return colorMaybe;

      // numeric string -> convert like number
      if (/^\d+(\.\d+)?$/.test(value)) {
        return this.tokensParser.convertNumberByKey(Number(value), opts.key, opts);
      }
      // keep already unit'ed values
      if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) {
        return value;
      }
      return value;
    }

    if (_.isArray(value)) {
      return value.map((v) => this.normalizeValue(v, opts)).join(' ');
    }

    if (_.isPlainObject(value)) {
      // token object with { value/$value, type/$type, unit/$unit, meta/$meta ... }
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
      // plain object -> parse as map
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
        return `${k}: "${String(v)}"`;
      }
    });

    return `(\n  ${entries.join(',\n  ')}\n)`;
  }

  parseMap<T extends object>(map: Value<T>, opts: ParseValueOptions, path: string[] = []): string {
    // whether to preserve original token structure when generating SCSS map
    const useReflect = this.tokensParser.opts.useReflectOriginalStructure ?? true;

    // primitives
    if (typeof map === 'string') return this.normalizeValue(map, opts);
    if (_.isArray(map)) return this.parseList(map, opts);
    if (!_.isPlainObject(map)) return this.normalizeValue(map, opts);

    const obj = map as IMap;
    const keys = Object.keys(obj);
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
    ].some((k) => keys.includes(k));

    // helper: build list of candidate paths/names to compare against exclude list
    const buildExcludeCandidates = (): string[] => {
      const candidates: string[] = [];
      const fileName = opts?.fileName ?? '';

      if (fileName) {
        candidates.push(fileName, `${fileName}.json`);
      }

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

      if (excluded.endsWith('/')) {
        return candidates.some((c) => c.startsWith(excluded));
      }

      return candidates.some(
        (c) => c === excluded || c.endsWith(`/${excluded}`) || excluded.endsWith(`/${c}`),
      );
    };

    if (hasTokenFields) {
      const tokenObj = obj as IMap;

      // --- check exclude list for CSS variables ---
      const excludeList = this.tokensParser.opts?.mapOptions?.excludeCSSVariables ?? [];
      const candidates = buildExcludeCandidates();

      let isExcluded = false;
      for (const excludedRaw of excludeList) {
        if (matchesExcluded(excludedRaw, candidates)) {
          isExcluded = true;
          break;
        }
      }

      // resolved fields via helpers
      const metaVal = this.tokensParser.getTokenField(tokenObj, 'meta');
      const typeVal = this.tokensParser.getTokenField(tokenObj, 'type');
      const unitVal = this.tokensParser.getTokenField(tokenObj, 'unit');
      const valueVal = this.tokensParser.getTokenField(tokenObj, 'value');

      // --- determine whether we must export this token as CSS var ---
      const globalMapFlag = this.tokensParser.opts?.mapOptions?.convertToCSSVariables ?? false;
      const localMapFlag = opts?.convertToCSSVariables ?? false;
      const shouldExportAsVar =
        !isExcluded &&
        (Boolean(metaVal?.build?.web?.exportAsVar) ||
          Boolean(localMapFlag) ||
          Boolean(globalMapFlag));

      if (shouldExportAsVar && valueVal !== undefined) {
        const explicitVarName = metaVal?.build?.web?.varName;
        const pathPart = path.filter(Boolean).join('-');
        const filePart = opts.fileName
          ? opts.convertCase
            ? this.tokensParser.toKebabCase(opts.fileName)
            : opts.fileName
          : '';

        let computedNameSource = explicitVarName
          ? explicitVarName
          : pathPart || (filePart ? `${filePart}` : '');

        // include file name into var if requested
        if (
          !explicitVarName &&
          this.tokensParser.opts?.mapOptions?.includeFileNameToCSSVariables &&
          filePart
        ) {
          if (!computedNameSource.startsWith(filePart)) {
            computedNameSource = computedNameSource
              ? `${filePart}-${computedNameSource}`
              : filePart;
          }
        }

        const varName =
          computedNameSource && computedNameSource.startsWith('--')
            ? computedNameSource
            : `--${computedNameSource || opts.fileName || 'token'}`;

        const localOpts: ParseValueOptions = {
          ...opts,
          key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
          unit:
            this.tokensParser.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
              ? (unitVal as string)
              : opts.unit,
        };

        let cssValue: string | undefined;
        if (_.isPlainObject(valueVal) || Array.isArray(valueVal)) {
          cssValue = this.parseMap(valueVal as any, localOpts, [...path, 'value']);
        } else {
          cssValue = this.normalizeValue(valueVal, localOpts);
        }

        if (cssValue !== undefined && cssValue !== 'undefined') {
          const prev = this.collectedCssVars.get(varName);
          if (prev !== undefined && prev !== cssValue && this.tokensParser.opts.verbose) {
            console.warn(
              `⚠️ CSS var conflict for "${varName}": "${prev}" -> "${cssValue}" (using ${
                (this.tokensParser.opts.cssVarsPrefer ?? 'last') === 'last' ? 'last' : 'first'
              })`,
            );
          }

          const prefer = this.tokensParser.opts.cssVarsPrefer ?? 'last';
          if (prev === undefined || prefer === 'last') {
            this.collectedCssVars.set(varName, cssValue);
          }
        }
      }

      // --- reflect original structure back to SCSS map ---
      if (useReflect) {
        const parts: string[] = [];

        // value
        if (valueVal !== undefined) {
          if (_.isPlainObject(valueVal)) {
            parts.push(`value: ${this.parseMap(valueVal as any, opts, [...path, 'value'])}`);
          } else if (Array.isArray(valueVal)) {
            parts.push(`value: ${this.parseList(valueVal as any[], opts)}`);
          } else {
            const localOpts: ParseValueOptions = {
              ...opts,
              key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
              unit:
                this.tokensParser.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
                  ? (unitVal as string)
                  : opts.unit,
            };
            parts.push(`value: ${this.normalizeValue(valueVal, localOpts)}`);
          }
        }

        // type / unit are scalar fields (if present)
        if (typeVal !== undefined) {
          let parsed = this.normalizeValue(typeVal, opts);
          parts.push(`type: "${parsed}"`);
        }
        if (unitVal !== undefined) {
          let parsed = this.normalizeValue(unitVal, opts);
          parts.push(`unit: "${parsed}"`);
        }

        // description: include only if it is NOT an object
        if (
          (tokenObj as any).description !== undefined &&
          !_.isPlainObject((tokenObj as any).description)
        ) {
          let parsed = this.normalizeValue((tokenObj as any).description, opts);
          parts.push(`description: "${parsed}"`);
        }

        // meta: serialize explicitly
        if (metaVal !== undefined) {
          const serializedMeta = this.serializeMeta(metaVal, opts, [...path, 'meta']);
          parts.push(`meta: ${serializedMeta}`);
        }

        // extra keys: exclude token fields (both regular and $-aliases)
        const excluded = new Set([
          'value',
          'type',
          'unit',
          'meta',
          '$value',
          '$type',
          '$unit',
          '$meta',
        ]);
        const extraKeys = keys.filter((k) => {
          if (excluded.has(k)) return false;
          if (k === 'description') {
            return _.isPlainObject((map as IMap)[k]);
          }
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
      } else {
        // not reflecting original structure
        if (valueVal === undefined) {
          // container of nested tokens
          const nestedParts: string[] = [];
          const excluded = new Set(['type', 'unit', 'meta', '$type', '$unit', '$meta']);
          const subKeys = keys.filter((k) => {
            if (excluded.has(k)) return false;
            if (k === 'description') {
              return _.isPlainObject((map as IMap)[k]);
            }
            return true;
          });

          for (const subKey of subKeys) {
            const kebabKey = opts.convertCase ? this.tokensParser.toKebabCase(subKey) : subKey;
            const value = this.parseMap((map as IMap)[subKey] as any, opts, [...path, kebabKey]);
            nestedParts.push(`${kebabKey}: ${value}`);
          }

          // include meta (without meta.description) if present (either meta or $meta)
          const rawMeta = this.tokensParser.getTokenField(map, 'meta');
          if (rawMeta !== undefined && !subKeys.includes('meta')) {
            const serializedMeta = this.serializeMeta(rawMeta, opts, [...path, 'meta']);
            nestedParts.push(`meta: ${serializedMeta}`);
          }

          return `(\n  ${nestedParts.join(',\n  ')}\n)`;
        }

        // token has a value -> return final normalized value
        const localOpts: ParseValueOptions = {
          ...opts,
          key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
          unit:
            this.tokensParser.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
              ? (unitVal as string)
              : opts.unit,
        };

        if (_.isPlainObject(valueVal)) {
          return this.parseMap(valueVal as any, localOpts, [...path, 'value']);
        } else if (Array.isArray(valueVal)) {
          return this.parseList(valueVal as any[], localOpts);
        } else {
          return this.normalizeValue(valueVal, localOpts);
        }
      }
    }

    // plain object (not a token)
    const nestedParts: string[] = [];
    for (const [k, v] of Object.entries(map as Record<string, any>)) {
      if (!this.tokensParser.isKeyValidated(k)) continue;
      const kebabKey = opts.convertCase ? this.tokensParser.toKebabCase(k) : k;

      // remove description ONLY inside meta
      if (k === 'description' && path[path.length - 1] === 'meta') {
        continue;
      }

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
  defaultVarsOptions: ParseValueOptions;
  fileCache: Record<string, any> = {};

  constructor(opts: TokensParserOptions) {
    this.opts = {
      ...opts,
      verbose: opts.verbose ?? false,
      cssVarsPrefer: opts.cssVarsPrefer ?? 'last',

      mapOptions: {
        convertCase: opts.mapOptions?.convertCase ?? false,
        includeFileName: opts.mapOptions?.includeFileName ?? true,
        convertToCSSVariables: opts.mapOptions?.convertToCSSVariables ?? false,
        includeFileNameToCSSVariables: opts.mapOptions?.includeFileNameToCSSVariables ?? false,
        excludeCSSVariables: opts.mapOptions?.excludeCSSVariables ?? [],
      },

      builder: {
        format: 'json',
        outDir: opts.builder?.outDir ?? opts.source,
        paths: opts.builder?.paths ?? opts.paths ?? ['.'],
        includeRootDirName: opts.builder?.includeRootDirName ?? false,
        useTokensInSeparateFiles: opts.builder?.useTokensInSeparateFiles ?? true,
      },
    };

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
    };

    this.defaultVarsOptions = {
      ...this.defaultParseOptions,
      ...opts.varsOptions,
    };
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
    return 'hex';
  }

  private formatColor(c: ReturnType<typeof Color>, unit?: string): string {
    const fmt = this.normalizeUnit(unit);
    const a = c.alpha();

    const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

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

  /**
   * Color expression evaluator.
   * Supports: rgba(color, a), lighten(color, x), darken(color, x), saturate(color, x), desaturate(color, x)
   * `color` can be: a color string, a {link}, or a nested function.
   * IMPORTANT: returns a Color object (not formatted). Formatting happens in tryParseColor().
   */
  private evaluateColorExpression(expr: string): ReturnType<typeof Color> | null {
    let s = expr.trim();

    // Plain color?
    const plain = this.tryToColor(s);
    if (plain) return plain;

    // Function call?
    const fnMatch = /^([a-zA-Z]+)\((.*)\)$/.exec(s);
    if (!fnMatch) return null;

    const fn = fnMatch[1].toLowerCase();
    const argsStr = fnMatch[2];

    // Split args by commas while respecting nested parentheses
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
      const c = this.tryToColor(String(resolved).trim());
      return c;
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

    // 1) Resolve a leading single {ref}, if any
    const resolved = raw.startsWith('{')
      ? String(this.parseNestedValue(raw, this.defaultParseOptions))
      : raw;

    // 2) Try parsing as a direct color
    const direct = this.tryToColor(resolved);
    if (direct) return this.formatColor(direct, unitForFormat);

    // 3) Try parsing as a color expression (returns Color), then format
    const exprColor = this.evaluateColorExpression(resolved);
    if (exprColor) return this.formatColor(exprColor, unitForFormat);

    // 4) If there are embedded refs anywhere in the string, resolve them and try again
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

  normalizeValue(value: any, opts: ParseValueOptions): string {
    if (typeof value === 'number') {
      return this.convertNumberByKey(value, opts.key, opts);
    }

    if (typeof value === 'string') {
      if (value.startsWith('{')) {
        const nested = this.parseNestedValue(value, opts);
        return this.normalizeValue(nested, opts);
      }

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

    if (Array.isArray(value)) {
      return value.map((v) => this.normalizeValue(v, opts)).join(' ');
    }

    if (_.isPlainObject(value) && this.hasTokenField(value, 'value')) {
      const typeVal = this.getTokenField(value, 'type');
      const unitVal = this.getTokenField(value, 'unit');
      const localOpts: ParseValueOptions = {
        ...opts,
        key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
        unit:
          this.hasTokenField(value, 'unit') && typeof unitVal === 'string'
            ? (unitVal as string)
            : opts.unit,
      };
      return this.normalizeValue(this.getTokenField(value, 'value'), localOpts);
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
    if (depth > 5) return value;
    const regex = /{([^}]+)}/g;
    let result = value;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(result)) !== null) {
      const fullMatch = match[0];
      const pathStr = match[1];

      if (visited.has(fullMatch)) {
        if (this.opts.verbose) console.warn(`⚠️ Circular reference detected: ${fullMatch}`);
        continue;
      }

      visited.add(fullMatch);

      const pathParts = pathStr.split('.');
      const fileName = pathParts.shift();
      if (!fileName) {
        visited.delete(fullMatch);
        continue;
      }

      // 1) Direct load <paths>/<fileName>.json
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
            // try next path
          }
        }
      }

      // 2) If not found and folder-structure lookup is allowed, try resolving by tree
      if (!fileFound && this.opts.useFileStructureLookup) {
        const resolved = this.resolveTokenPathRecursiveSync(pathStr);
        if (resolved !== undefined) {
          result = result.replace(fullMatch, resolved as any);
          visited.delete(fullMatch);
          continue;
        }
      }

      if (!fileFound) {
        if (this.opts.verbose)
          console.warn(
            `⚠️ Token file "${fileName}.json" not found in paths: ${(this.opts.paths ?? ['.']).join(', ')}`,
          );
        visited.delete(fullMatch);
        continue;
      }

      let nestedValue = pathParts.reduce((acc, key) => acc?.[key], json);
      if (nestedValue === undefined) {
        if (this.opts.verbose)
          console.warn(`⚠️ Token path "${pathStr}" not found in file "${fileName}"`);
        visited.delete(fullMatch);
        continue;
      }

      if (typeof nestedValue === 'string' && nestedValue.startsWith('{')) {
        nestedValue = this.parseNestedValue(nestedValue, opts, depth + 1, visited);
      }

      result = result.replace(fullMatch, nestedValue);
      visited.delete(fullMatch);
    }

    return result;
  }

  flattenToCSSVariables(
    obj: any,
    path: string[] = [],
    result: string[] = [],
    opts?: ParseValueOptions,
  ): string[] {
    const useOpts = opts ?? this.defaultVarsOptions;

    if (_.isPlainObject(obj) && this.hasTokenField(obj, 'value')) {
      const flatPath =
        useOpts.includeFileName && useOpts.fileName
          ? [useOpts.convertCase ? this.toKebabCase(useOpts.fileName!) : useOpts.fileName!, ...path]
          : path;

      const cssVarName = `--${flatPath.join('-')}`;
      const rawVal = this.getTokenField(obj, 'value');
      const finalValue =
        rawVal !== undefined ? (this.parser.parseValue as any)(rawVal, useOpts) : 'initial';

      result.push(`${cssVarName}: ${finalValue};`);
      return result;
    }

    for (const [key, value] of Object.entries(obj)) {
      const newKey = useOpts.convertCase ? this.toKebabCase(key) : key;
      const newPath = [...path, newKey];
      if (_.isPlainObject(value)) {
        this.flattenToCSSVariables(value, newPath, result, useOpts);
      }
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
    // helper: serialize a single theme object into array of css var lines
    const collectVarsFromTheme = (themeObj: any, prefixPath: string[] = []) => {
      const vars: string[] = [];

      const walk = (obj: any, path: string[] = []) => {
        if (_.isPlainObject(obj) && this.hasTokenField(obj, 'value')) {
          const meta = this.getTokenField(obj, 'meta');
          const exportAsVar = meta?.build?.web?.exportAsVar ?? false;

          if (!includeRequired || exportAsVar) {
            const cssVarName = `--${[...prefixPath, ...path].join('-')}`;
            const rawVal = this.getTokenField(obj, 'value');
            vars.push(
              `${cssVarName}: ${(this.parser.parseValue as any)(rawVal, this.defaultVarsOptions)}`,
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

    // unwrap wrapper if needed
    const rootKeys = Object.keys(themes);
    if (rootKeys.length === 1) {
      const onlyKey = rootKeys[0];
      const onlyVal = themes[onlyKey];
      if (
        _.isPlainObject(onlyVal) &&
        Object.keys(onlyVal).length > 0 &&
        Object.values(onlyVal).every((v) => _.isPlainObject(v))
      ) {
        themes = onlyVal as Record<string, any>;
      }
    }

    for (const [rawThemeName, themeObj] of Object.entries(themes)) {
      if (!_.isPlainObject(themeObj)) continue;

      const themeName = this.toKebabCase(rawThemeName);

      const vars = collectVarsFromTheme(themeObj);

      if (vars.length === 0) {
        continue;
      }

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
      varsOptions,
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

    const parseVarsOptions: ParseValueOptions = {
      ...baseOptions,
      ...(varsOptions || {}),
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

      // Clear previously collected CSS variables (avoid duplicates across files)
      if (this.parser instanceof SCSSParser) {
        this.parser.clearCssVars();
      }

      // Generate SCSS maps
      for (const [k, v] of Object.entries(rootMap)) {
        const kebabKey = parseMapOptions.convertCase ? this.toKebabCase(k) : k;
        const keyLine = `$${kebabKey}:`;
        const map = v as IMap;

        // IMPORTANT: pass initial path = [kebabKey] to preserve the prefix
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

        const str = `${keyLine}${(this.parser as SCSSParser).parseMap(map, parseMapOptions, initialPath)};`;
        content += `${str}\n`;
      }

      // CSS vars collected during map parsing
      if (this.parser instanceof SCSSParser) {
        const cssVarsBlock = this.parser.getCssVarsBlock();
        if (cssVarsBlock) {
          content += cssVarsBlock;
        }
      }

      // Legacy: flatten all tokens to CSS vars (if requested)
      if (parseVarsOptions.convertToCSSVariables) {
        const flatVars = this.flattenToCSSVariables(json, [], [], parseVarsOptions);
        const cssContent = `:root {\n  ${flatVars.join('\n  ')}\n}`;
        if (this.opts.cssVarsOutDir) {
          const cssOutPath = `${this.opts.cssVarsOutDir}/${parseVarsOptions.fileName}.css`;
          await fs.writeFile(cssOutPath, cssContent);
          console.log(`CSS variables written to ${cssOutPath}`);
        } else {
          content += `\n${cssContent}\n`;
        }
      }

      // write file
      await fs.writeFile(outputPath, content);
      console.log(`${name} parsed to ${outputPath}`);
    } catch (err) {
      console.error(err);
    }
  }

  /* * * listDir * * */
  private async listDir(source: string, output: string) {
    try {
      const fileNames = await fs.readdir(source);
      for (const fileName of fileNames) {
        if (/^(?=.).*.json$/.test(fileName)) {
          // resolve references and write resolved json into build dir
          await this.resolveAndSaveJson(`${source}/${fileName}`, fileName);

          // generate SCSS from resolved json in build dir
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
              varsOptions: this.defaultVarsOptions,
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

          // If resolved to a color expression or color string, normalize it using parent opts
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
      const files = await fs.readdir(build);
      const jsonFiles = files.filter((f: string) => f.endsWith('.json'));

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

      const spreadList = jsonFiles.map((file: string) => file.replace('.json', '')).join(', ');

      const content = `${imports}\n\nconst module = {\n  ${spreadList
        .split(', ')
        .map((name: string) => `...${name}`)
        .join(',\n  ')}\n};\n\nexport default module;\n`;

      const entryDir = nodePath.dirname(entryFilePath);
      await fs.mkdir(entryDir, { recursive: true });
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

      // 1) Try "<currentDir>/<head>.json"
      const head = currentParts[0];
      const filePath = nodePath.join(currentDir, `${head}.json`);
      if (this.isFileSync(filePath)) {
        try {
          const content = JSON.parse(readFileSync(filePath, 'utf-8'));
          if (currentParts.length === 1) return content;
          return this.getNestedValue(content, currentParts.slice(1));
        } catch {
          // ignore and continue
        }
      }

      // 2) Try as directory "<currentDir>/<head>/..."
      const dirPath = nodePath.join(currentDir, head);
      if (this.isDirSync(dirPath)) {
        const res = tryResolve(currentParts.slice(1), dirPath);
        if (res !== undefined) return res;
      }

      // 3) Gradient search: join several segments into one file
      for (let i = currentParts.length; i > 0; i--) {
        const joined = currentParts.slice(0, i).join('/');
        const joinedFile = nodePath.join(currentDir, `${joined}.json`);
        if (this.isFileSync(joinedFile)) {
          try {
            const content = JSON.parse(readFileSync(joinedFile, 'utf-8'));
            return this.getNestedValue(content, currentParts.slice(i));
          } catch {
            // ignore and continue
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
