// This file were developed with the assistance of AI tools.
//
import { readFileSync, statSync } from 'node:fs';
import nodePath from 'node:path';

import type {
  IncludeServiceFields,
  IncludeServiceFieldsConfig,
  ParseValueOptions,
  ServiceField,
  TokensParserOptions,
} from '../types.js';

export interface ResolverConfig {
  opts: TokensParserOptions;
  fileCache: Record<string, any>;
  defaultParseOptions: ParseValueOptions;
  verbose: boolean;
  globalInclude?: IncludeServiceFields;
  useFileStructureLookup?: boolean;
}

export class TokenResolver {
  private readonly opts: TokensParserOptions;
  private readonly fileCache: Record<string, any>;
  private readonly defaultParseOptions: ParseValueOptions;
  private readonly verbose: boolean;
  private readonly globalInclude?: IncludeServiceFields;
  private readonly useFileStructureLookup: boolean;

  constructor({
    opts,
    fileCache,
    defaultParseOptions,
    verbose,
    globalInclude,
    useFileStructureLookup,
  }: ResolverConfig) {
    this.opts = opts;
    this.fileCache = fileCache;
    this.defaultParseOptions = defaultParseOptions;
    this.verbose = Boolean(verbose);
    this.globalInclude = globalInclude;
    this.useFileStructureLookup = Boolean(useFileStructureLookup);
  }

  /* Include service fields --------------------------------------------------------------- */

  public resolveIncludeServiceFields(opts: ParseValueOptions): IncludeServiceFieldsConfig {
    const local = this.normalizeIncludeServiceFields(opts.includeServiceFields);
    if (local.includeAll || local.set.size > 0) return local;

    return this.normalizeIncludeServiceFields(this.globalInclude);
  }

  private normalizeIncludeServiceFields(raw?: IncludeServiceFields): IncludeServiceFieldsConfig {
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
        return {
          includeAll: false,
          set: new Set<ServiceField>(['value', 'type', 'unit']),
        };
      }
      const valid: ServiceField[] = ['value', 'type', 'unit', 'meta', 'respond'];
      const set = new Set<ServiceField>(
        raw.filter((x): x is ServiceField => valid.includes(x as ServiceField)),
      );
      return { includeAll: false, set };
    }

    return { includeAll: false, set: new Set<ServiceField>() };
  }

  /* Token field helpers ------------------------------------------------------------------ */

  public coerceTokenObjectToScalar(maybeTokenObj: any): any {
    if (maybeTokenObj && typeof maybeTokenObj === 'object') {
      const hasPlain = Object.prototype.hasOwnProperty.call(maybeTokenObj, 'value');
      const hasDollar = Object.prototype.hasOwnProperty.call(maybeTokenObj, '$value');
      if (hasPlain || hasDollar) {
        const raw = hasPlain ? maybeTokenObj.value : maybeTokenObj.$value;
        return raw;
      }
    }
    return maybeTokenObj;
  }

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

  /* Nested references -------------------------------------------------------------------- */

  public parseNestedValue(
    value: string,
    opts: ParseValueOptions,
    depth = 0,
    visited: Set<string> = new Set(),
  ): string {
    if (depth > 100) {
      if (this.verbose) {
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
        if (this.verbose) {
          console.warn(
            `⚠️ [parseNestedValue] repeated ref "{${pathStr}}" within same value in "${opts.fileName ?? ''}" — possible cycle.`,
          );
        }
        continue;
      }
      localSeen.add(pathStr);

      if (visited.has(pathStr)) {
        if (this.verbose) {
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

      if (this.verbose) {
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
            // Continue to next path
          }
        }
      }

      if (!fileFound && this.useFileStructureLookup) {
        const resolved = this.resolveTokenPathRecursiveSync(pathStr);
        if (resolved !== undefined) {
          const scalar = this.normalizeResolvedValue(resolved, opts, depth, visited, pathStr);
          if (value === fullMatch) return scalar;
          result = result.replace(fullMatch, scalar as any);
          regex.lastIndex = 0;
          madeAnyReplacement = true;
          visited.delete(pathStr);
          continue;
        }
      }

      if (!fileFound) {
        if (this.verbose) {
          console.warn(
            `⚠️ [parseNestedValue] file "${fileName}.json" not found while resolving {${pathStr}} (paths: ${(this.opts.paths ?? ['.']).join(', ')})`,
          );
        }
        visited.delete(pathStr);
        continue;
      }

      let nestedValue = pathParts.reduce((acc, key) => acc?.[key], json);
      if (nestedValue === undefined) {
        if (this.verbose) {
          console.warn(
            `⚠️ [parseNestedValue] path "${pathStr}" not found inside "${fileName}.json"`,
          );
        }
        if (this.useFileStructureLookup) {
          const resolved = this.resolveTokenPathRecursiveSync(pathStr);
          if (resolved !== undefined) {
            const scalar = this.normalizeResolvedValue(resolved, opts, depth, visited, pathStr);
            if (value === fullMatch) return scalar;
            result = result.replace(fullMatch, scalar as any);
            regex.lastIndex = 0;
            madeAnyReplacement = true;
            visited.delete(pathStr);
            continue;
          }
        }
        visited.delete(pathStr);
        continue;
      }

      nestedValue = this.coerceTokenObjectToScalar(nestedValue);

      if (typeof nestedValue === 'string' && nestedValue.startsWith('{')) {
        nestedValue = this.parseNestedValue(nestedValue, opts, depth + 1, visited);
      }

      if (value === fullMatch) {
        visited.delete(pathStr);
        return nestedValue;
      }

      result = result.replace(fullMatch, nestedValue);
      regex.lastIndex = 0;
      madeAnyReplacement = true;
      visited.delete(pathStr);
    }

    if (!madeAnyReplacement && this.verbose) {
      console.warn(
        `⚠️ [parseNestedValue] no matches/replacements in "${opts.fileName ?? ''}" for: ${value}`,
      );
    }

    return result;
  }

  public resolveTokenPathRecursiveSync(pathStr: string): any {
    const parts = pathStr.split('.');

    const tryResolve = (currentParts: string[], currentDir: string): any => {
      if (currentParts.length === 0) return undefined;

      const head = currentParts[0];

      const filePath = nodePath.join(currentDir, `${head}.json`);
      if (this.isFileSync(filePath)) {
        try {
          const content = JSON.parse(readFileSync(filePath, 'utf-8'));
          if (currentParts.length === 1) return content;
          return this.getNestedValue(content, currentParts.slice(1));
        } catch {
          // ignore parse errors
        }
      }

      const dirPath = nodePath.join(currentDir, head);
      if (this.isDirSync(dirPath)) {
        const res = tryResolve(currentParts.slice(1), dirPath);
        if (res !== undefined) return res;
      }

      for (let i = currentParts.length; i > 0; i--) {
        const joined = currentParts.slice(0, i).join('/');
        const joinedFile = nodePath.join(currentDir, `${joined}.json`);
        if (this.isFileSync(joinedFile)) {
          try {
            const content = JSON.parse(readFileSync(joinedFile, 'utf-8'));
            return this.getNestedValue(content, currentParts.slice(i));
          } catch {
            // ignore parse errors
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

  private normalizeResolvedValue(
    raw: any,
    opts: ParseValueOptions,
    depth: number,
    visited: Set<string>,
    traceKey: string,
  ): any {
    let scalar = this.coerceTokenObjectToScalar(raw);
    if (typeof scalar === 'string' && scalar.startsWith('{')) {
      scalar = this.parseNestedValue(scalar, opts, depth + 1, visited);
    } else if (scalar && typeof scalar === 'object') {
      // Deep clone objects resolved via structural lookup to avoid inline mutations.
      scalar = JSON.parse(JSON.stringify(scalar));
    }

    if (scalar === undefined && this.verbose) {
      console.warn(
        `⚠️ [parseNestedValue] structural lookup returned undefined for {${traceKey}}`,
      );
    }

    return scalar;
  }

  /* helpers ------------------------------------------------------------------------------ */

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
}
