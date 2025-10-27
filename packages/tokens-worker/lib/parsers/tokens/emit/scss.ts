// This file were developed with the assistance of AI tools.
//
import nodePath from 'node:path';
import * as _ from 'lodash-es';

import type {
  IMap,
  IncludeServiceFieldsConfig,
  List,
  ParseValueOptions,
  TokensParserOptions,
  Value,
} from '../types.js';
import type { TokenResolver } from '../core/resolver.js';

export interface SCSSParserContext {
  opts: TokensParserOptions;
  cssVarsPrefer: 'first' | 'last';
  resolver: TokenResolver;
  defaultParseOptions: ParseValueOptions;
  convertNumberByKey(value: number, key?: string, opts?: ParseValueOptions): string;
  tryParseColor(value: string, unitForFormat?: string): string | null;
  parseNestedValue(value: string, opts: ParseValueOptions): string;
  resolveIncludeServiceFields(opts: ParseValueOptions): IncludeServiceFieldsConfig;
  toKebabCase(value: string): string;
  isKeyValid(value: string): boolean;
  verbose: boolean;
}

export abstract class Parser {
  abstract parseValue<T>(value: Value<T>, opts: ParseValueOptions): Value<T>;
  abstract parseList(list: List<unknown>, opts: ParseValueOptions): string;
  abstract parseMap<T extends object>(
    map: Value<T>,
    opts: ParseValueOptions,
    path?: string[],
  ): string;
}

export class SCSSParser extends Parser {
  private readonly ctx: SCSSParserContext;
  private collectedCssVars: Map<string, string> = new Map();

  constructor(ctx: SCSSParserContext) {
    super();
    this.ctx = ctx;
  }

  public clearCssVars(): void {
    this.collectedCssVars.clear();
  }

  public getCssVarsBlock(): string {
    if (this.collectedCssVars.size === 0) return '';
    const lines = [...this.collectedCssVars.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => `  ${name}: ${value};`);
    return `\n:root {\n${lines.join('\n')}\n}\n`;
  }

  parseValue(value: any, opts: ParseValueOptions): string {
    return this.normalizeValue(value, opts);
  }

  parseList(list: List<unknown>, opts: ParseValueOptions): string {
    return list.map((v) => this.normalizeValue(v, opts)).join(' ');
  }

  parseMap<T extends object>(map: Value<T>, opts: ParseValueOptions, path: string[] = []): string {
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
      'respond',
      '$respond',
    ].some((k) => keys.includes(k));

    const buildExcludeCandidates = (): string[] => {
      const candidates: string[] = [];
      const fileName = opts?.fileName ?? '';
      if (fileName) candidates.push(fileName, `${fileName}.json`);

      const buildRoot = this.ctx.opts.build;
      if (buildRoot && fileName) {
        try {
          candidates.push(nodePath.resolve(buildRoot, `${fileName}.json`));
        } catch {}
      }

      const sourceRoot = this.ctx.opts.source;
      if (sourceRoot && fileName) {
        try {
          candidates.push(nodePath.resolve(sourceRoot, `${fileName}.json`));
        } catch {}
      }

      for (const p of this.ctx.opts.paths ?? []) {
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

    if (hasTokenFields) {
      const tokenObj = obj as IMap;

      const includeCfg = this.ctx.resolveIncludeServiceFields(opts);
      const want = (name: 'value' | 'type' | 'unit' | 'meta' | 'respond') =>
        includeCfg.includeAll || includeCfg.set.has(name);

      const serviceMode = includeCfg.includeAll || includeCfg.set.size > 0;

      const serviceSymbols =
        (opts.includeSymbolsInServiceFields ??
          this.ctx.opts?.mapOptions?.includeSymbolsInServiceFields ??
          false) === true;

      const svc = (name: string) => (serviceSymbols ? `$${name}` : name);

      const metaVal = this.ctx.resolver.getTokenField(tokenObj, 'meta');
      const typeVal = this.ctx.resolver.getTokenField(tokenObj, 'type');
      const unitVal = this.ctx.resolver.getTokenField(tokenObj, 'unit');
      const valueVal = this.ctx.resolver.getTokenField(tokenObj, 'value');
      const respondVal = this.ctx.resolver.getField<any>(tokenObj, 'respond');

      const excludeList =
        this.ctx.opts?.cssVarOptions?.excludeCSSVariables ??
        this.ctx.opts?.mapOptions?.excludeCSSVariables ??
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
        this.ctx.opts?.cssVarOptions?.convertToCSSVariables ??
        this.ctx.opts?.mapOptions?.convertToCSSVariables ??
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
          const resolved = this.ctx.parseNestedValue(explicitVarName, this.ctx.defaultParseOptions);
          explicitVarName = String(resolved);
        }
        const pathPart = path.filter(Boolean).join('-');
        const filePart = opts.fileName
          ? opts.convertCase
            ? this.ctx.toKebabCase(opts.fileName)
            : opts.fileName
          : '';
        let computedNameSource = explicitVarName
          ? explicitVarName
          : pathPart || (filePart ? `${filePart}` : '');
        const includeFileNameToCSS =
          this.ctx.opts?.cssVarOptions?.includeFileNameToCSSVariables ??
          this.ctx.opts?.mapOptions?.includeFileNameToCSSVariables ??
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

        const effectivePrefix =
          (opts.prefix && opts.prefix.length ? opts.prefix : undefined) ??
          (this.ctx.opts.mapOptions?.prefix && this.ctx.opts.mapOptions?.prefix !== ''
            ? this.ctx.opts.mapOptions?.prefix
            : undefined) ??
          (this.ctx.opts.cssVarOptions?.prefix && this.ctx.opts.cssVarOptions?.prefix !== ''
            ? this.ctx.opts.cssVarOptions?.prefix
            : undefined) ??
          '';

        if (effectivePrefix) {
          varName = this.applyCssVarPrefix(varName, effectivePrefix);
        }

        const localOptsForVar: ParseValueOptions = {
          ...opts,
          key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
          unit:
            this.ctx.resolver.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
              ? (unitVal as string)
              : opts.unit,
        };

        let cssValue: string | undefined;
        if (_.isPlainObject(valueVal) || Array.isArray(valueVal)) {
          cssValue = this.parseMap(valueVal as any, localOptsForVar, [...path, 'value']);
        } else {
          cssValue = this.normalizeValue(valueVal, localOptsForVar, 1);
        }

        if (cssValue !== undefined && cssValue !== 'undefined') {
          const prev = this.collectedCssVars.get(varName);
          if (prev !== undefined && prev !== cssValue && this.ctx.verbose) {
            console.warn(
              `⚠️ CSS var conflict for "${varName}": "${prev}" -> "${cssValue}" (using ${
                (this.ctx.cssVarsPrefer ?? 'last') === 'last' ? 'last' : 'first'
              })`,
            );
          }
          const prefer = this.ctx.cssVarsPrefer ?? 'last';
          if (prev === undefined || prefer === 'last') {
            this.collectedCssVars.set(varName, cssValue);
          }
        }
      }

      const serializeMeta = (meta: any) => this.serializeMeta(meta, opts);

      const localOpts: ParseValueOptions = {
        ...opts,
        key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
        unit:
          this.ctx.resolver.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
            ? (unitVal as string)
            : opts.unit,
        includeServiceFields: opts.includeServiceFields,
      };

      const serializeServiceToken = (val: any, tVal: any, uVal: any): string | null => {
        const normalized = this.normalizeValue(val, {
          ...localOpts,
          key: typeof tVal === 'string' ? tVal : localOpts.key,
          unit: typeof uVal === 'string' ? uVal : localOpts.unit,
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

        const onlyValueSelected =
          items.length === 1 && items[0].startsWith(`${svc('value')}:`) && !serviceSymbols;
        if (onlyValueSelected) return rendered;

        return `(\n  ${items.join(',\n  ')}\n)`;
      };

      const serializeRespond = (resp: any, pth: string[]): string => {
        if (!_.isPlainObject(resp)) return '()';

        const entries: string[] = [];

        for (const [rk, rv] of Object.entries(resp)) {
          const key = opts.convertCase ? this.ctx.toKebabCase(rk) : rk;

          if (_.isPlainObject(rv) && this.ctx.resolver.hasTokenField(rv, 'value')) {
            const t = this.ctx.resolver.getTokenField(rv, 'type');
            const u = this.ctx.resolver.getTokenField(rv, 'unit');
            const v = this.ctx.resolver.getTokenField(rv, 'value');

            const tokenMap = serializeServiceToken(v, t, u);
            if (tokenMap) entries.push(`${key}: ${tokenMap}`);
            continue;
          }

          if (_.isPlainObject(rv)) {
            const innerParts: string[] = [];

            for (const [ik, iv] of Object.entries(rv as Record<string, unknown>)) {
              const ikb = opts.convertCase ? this.ctx.toKebabCase(ik) : ik;

              if (_.isPlainObject(iv) && this.ctx.resolver.hasTokenField(iv, 'value')) {
                const t = this.ctx.resolver.getTokenField(iv, 'type');
                const u = this.ctx.resolver.getTokenField(iv, 'unit');
                const v = this.ctx.resolver.getTokenField(iv, 'value');

                const tokenMap = serializeServiceToken(v, t, u);
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

      const parts: string[] = [];

      if (valueVal !== undefined) {
        if (serviceMode) {
          const serviceToken = serializeServiceToken(valueVal, typeVal, unitVal);
          if (serviceToken) parts.push(`${svc('value')}: ${serviceToken}`);
        } else {
          const normalizedValue = this.normalizeValue(valueVal, {
            ...opts,
            key: typeof typeVal === 'string' ? (typeVal as string) : opts.key,
            unit:
              this.ctx.resolver.hasTokenField(tokenObj, 'unit') && typeof unitVal === 'string'
                ? (unitVal as string)
                : opts.unit,
          });
          parts.push(`value: ${this.flattenSingleValueMap(normalizedValue)}`);
        }
      }

      if (typeVal !== undefined && !serviceMode) {
        parts.push(`type: "${this.normalizeValue(typeVal, opts)}"`);
      }
      if (unitVal !== undefined && !serviceMode) {
        parts.push(`unit: "${this.normalizeValue(unitVal, opts)}"`);
      }
      if (
        (tokenObj as any).description !== undefined &&
        !_.isPlainObject((tokenObj as any).description) &&
        !serviceMode
      ) {
        const parsed = this.normalizeValue((tokenObj as any).description, opts);
        parts.push(`description: "${parsed}"`);
      }

      if (metaVal !== undefined) {
        const metaSerialized = serializeMeta(metaVal);
        if (serviceMode) {
          if (want('meta')) parts.push(`${svc('meta')}: ${metaSerialized}`);
        } else {
          parts.push(`meta: ${metaSerialized}`);
        }
      }

      if (respondVal !== undefined) {
        const respondSerialized = serializeRespond(respondVal, [...path, svc('respond')]);
        if (respondSerialized !== '(\n  \n)') {
          if (serviceMode) {
            if (want('respond')) parts.push(`${svc('respond')}: ${respondSerialized}`);
          } else {
            parts.push(`respond: ${respondSerialized}`);
          }
        }
      }

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
        const kebabKey = opts.convertCase ? this.ctx.toKebabCase(extraKey) : extraKey;
        const value = this.parseMap((map as IMap)[extraKey] as Value<object>, opts, [
          ...path,
          kebabKey,
        ]);
        parts.push(`${kebabKey}: ${value}`);
      }

      return `(\n  ${parts.join(',\n  ')}\n)`;
    }

    const nestedParts: string[] = [];
    for (const [k, v] of Object.entries(map as Record<string, any>)) {
      if (!this.ctx.isKeyValid(k)) continue;
      const kebabKey = opts.convertCase ? this.ctx.toKebabCase(k) : k;

      if (k === 'description' && path[path.length - 1] === 'meta') continue;

      const value = this.parseMap(v as any, opts, [...path, kebabKey]);
      nestedParts.push(`${kebabKey}: ${value}`);
    }

    return `(\n  ${nestedParts.join(',\n  ')}\n)`;
  }

  private applyCssVarPrefix(name: string, prefix?: string): string {
    if (!prefix) return name;
    if (name.startsWith('--')) {
      const rest = name.slice(2);
      return `--${prefix}-${rest}`;
    }
    return `${prefix}-${name}`;
  }

  private serializeMeta(meta: any, opts: ParseValueOptions): string {
    if (!meta) return '()';

    const entries = Object.entries(meta).map(([k, v]) => {
      if (_.isPlainObject(v)) {
        return `${k}: ${this.serializeMeta(v, opts)}`;
      } else if (_.isArray(v)) {
        const arr = v
          .map((i) => (_.isPlainObject(i) ? this.serializeMeta(i, opts) : `"${i}"`))
          .join(', ');
        return `${k}: (\n    ${arr}\n  )`;
      } else {
        const normalized = this.normalizeValue(v, opts);
        const out =
          typeof normalized === 'string' && /^".*"$/.test(normalized)
            ? normalized
            : `"${String(normalized)}"`;
        return `${k}: ${out}`;
      }
    });

    return `(\n  ${entries.join(',\n  ')}\n)`;
  }

  private normalizeValue(
    value: any,
    opts: ParseValueOptions,
    depth = 0,
    trail: string[] = [],
  ): string {
    const maxDepth = 100;
    if (depth > maxDepth) {
      if (this.ctx.verbose) {
        console.warn(
          `⚠️ [normalizeValue] depth limit reached (>${maxDepth}) in file "${opts.fileName ?? ''}". Value preview: ${String(value).slice(0, 120)}…`,
        );
      }
      return String(value);
    }

    if (_.isString(value) && value.startsWith('{')) {
      const before = value;
      const nested = this.ctx.parseNestedValue(value, opts);
      if (nested === before) {
        if (this.ctx.verbose) {
          console.warn(
            `⚠️ [normalizeValue] no-progress after parseNestedValue in file "${opts.fileName ?? ''}". Ref: ${before}`,
          );
        }
        return before;
      }
      return this.normalizeValue(nested, opts, depth + 1, trail);
    }

    if (typeof value === 'number') {
      return this.ctx.convertNumberByKey(value, opts.key, opts);
    }

    if (typeof value === 'string') {
      const colorMaybe = this.ctx.tryParseColor(value, opts.unit);
      if (colorMaybe) return colorMaybe;

      if (/^\d+(\.\d+)?$/.test(value)) {
        return this.ctx.convertNumberByKey(Number(value), opts.key, opts);
      }
      if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) {
        return value;
      }
      return value;
    }

    if (_.isArray(value)) {
      return value.map((v) => this.normalizeValue(v, opts, depth + 1, trail)).join(' ');
    }

    if (_.isPlainObject(value)) {
      if (this.ctx.resolver.hasTokenField(value, 'value')) {
        const localOpts: ParseValueOptions = {
          ...opts,
          key:
            typeof this.ctx.resolver.getTokenField(value, 'type') === 'string'
              ? (this.ctx.resolver.getTokenField(value, 'type') as string)
              : opts.key,
          unit: (() => {
            const hasUnit = this.ctx.resolver.hasTokenField(value, 'unit');
            const unitVal = this.ctx.resolver.getTokenField(value, 'unit');
            return hasUnit && typeof unitVal === 'string' ? unitVal : opts.unit;
          })(),
        };
        return this.normalizeValue(
          this.ctx.resolver.getTokenField(value, 'value'),
          localOpts,
          depth + 1,
          trail,
        );
      }

      return this.parseMap(value as IMap, opts);
    }

    return String(value);
  }

  private flattenSingleValueMap(value: string): string {
    if (typeof value !== 'string') return value;
    let current = value.trim();
    const singleValuePattern = /^\(\s*value:\s*([\s\S]*?)\s*(?:,\s*)?\)$/;

    while (current.startsWith('(') && current.endsWith(')')) {
      const match = singleValuePattern.exec(current);
      if (!match) break;

      const inner = match[1].trim();
      if (!inner) break;
      if (inner === current) break;

      current = inner;
    }

    return current;
  }
}
