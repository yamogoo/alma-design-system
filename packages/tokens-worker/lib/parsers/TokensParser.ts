// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import fs from "node:fs/promises";
import nodePath from "node:path";
import { readFileSync } from "node:fs";
import * as _ from "lodash-es";

import { JSONBuilder, type JSONBuilderOptions } from "./JSONBuilder.js";

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
        status?: "unused" | "active";
      };
      ios: {
        applyMultiplier?: boolean;
        status?: "unused" | "active";
      };
      android: {
        applyMultiplier?: boolean;
        status?: "unused" | "active";
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
  useFileStructureLookup?: boolean;
  useReflectOriginalStructure?: boolean;
  themesDir?: string;
  themesOutFile?: string; // scss
  themesIncludeRequired?: boolean;
}

/* * * Abstract Parser * * */

abstract class Parser {
  abstract parseValue<T>(value: Value<T>, opts: ParseValueOptions): Value<T>;
  abstract parseList(list: List<unknown>, opts: ParseValueOptions): string;
  abstract parseMap<T extends object>(
    map: Value<T>,
    opts: ParseValueOptions,
    path?: string[]
  ): string;
}

/* * * SCSS Parser * * */

export class SCSSParser extends Parser {
  private tokensParser: TokensParser;
  private collectedCssVars: string[] = [];

  constructor(tokensParser: TokensParser) {
    super();
    this.tokensParser = tokensParser;
  }

  // PUBLIC: clear accumulated CSS variables (to avoid duplication between files)
  public clearCssVars() {
    this.collectedCssVars = [];
  }

  private normalizeValue(value: any, opts: ParseValueOptions): string {
    // nested token reference like "{file.key}"
    if (_.isString(value) && value.startsWith("{")) {
      const nested = this.tokensParser.parseNestedValue(value, opts);
      return this.normalizeValue(nested, opts);
    }

    if (typeof value === "number") {
      return this.tokensParser.convertNumberByKey(value, opts.key, opts);
    }

    if (typeof value === "string") {
      // numeric string -> convert like number
      if (/^\d+(\.\d+)?$/.test(value)) {
        return this.tokensParser.convertNumberByKey(
          Number(value),
          opts.key,
          opts
        );
      }
      return value;
    }

    if (_.isArray(value)) {
      return value.map((v) => this.normalizeValue(v, opts)).join(" ");
    }

    if (_.isPlainObject(value)) {
      // token object with { value, type, unit, meta ... }
      if ("value" in value) {
        const localOpts: ParseValueOptions = {
          ...opts,
          key:
            typeof (value as any).type === "string"
              ? (value as any).type
              : opts.key,
          unit:
            Object.prototype.hasOwnProperty.call(value, "unit") &&
            typeof (value as any).unit === "string"
              ? (value as any).unit
              : opts.unit,
        };
        return this.normalizeValue((value as any).value, localOpts);
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
    return list.map((v) => this.normalizeValue(v, opts)).join(" ");
  }

  private serializeMeta(
    meta: any,
    opts: ParseValueOptions,
    path: string[] = []
  ): string {
    if (!meta) return "()";

    const entries = Object.entries(meta).map(([k, v]) => {
      if (_.isPlainObject(v)) {
        return `${k}: ${this.serializeMeta(v, opts, [...path, k])}`;
      } else if (_.isArray(v)) {
        const arr = v
          .map((i) =>
            _.isPlainObject(i)
              ? this.serializeMeta(i, opts, [...path, k])
              : `"${i}"`
          )
          .join(", ");
        return `${k}: (\n    ${arr}\n  )`;
      } else {
        return `${k}: "${String(v)}"`;
      }
    });

    return `(\n  ${entries.join(",\n  ")}\n)`;
  }

  parseMap<T extends object>(
    map: Value<T>,
    opts: ParseValueOptions,
    path: string[] = []
  ): string {
    // whether to preserve original token structure when generating SCSS map
    const useReflect =
      this.tokensParser.opts.useReflectOriginalStructure ?? true;

    // primitives
    if (typeof map === "string")
      return this.tokensParser.parseNestedValue(map, opts);
    if (_.isArray(map)) return this.parseList(map, opts);
    if (!_.isPlainObject(map)) return String(map);

    const obj = map as IMap;
    const keys = Object.keys(obj);
    const hasTokenFields = ["value", "type", "unit", "description"].some((k) =>
      keys.includes(k)
    );

    // helper: build list of candidate paths/names to compare against exclude list
    const buildExcludeCandidates = (): string[] => {
      const candidates: string[] = [];
      const fileName = opts?.fileName ?? "";

      if (fileName) {
        candidates.push(fileName);
        candidates.push(`${fileName}.json`);
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

      const pathsArray = this.tokensParser.opts.paths ?? [];
      for (const p of pathsArray) {
        if (fileName) {
          try {
            candidates.push(nodePath.resolve(p, `${fileName}.json`));
          } catch {}
        }
      }

      return [...new Set(candidates)].map((c) =>
        (c || "").replace(/\\/g, "/").toLowerCase()
      );
    };

    const matchesExcluded = (excludedRaw: string, candidates: string[]) => {
      if (!excludedRaw) return false;
      const excluded = excludedRaw.replace(/\\/g, "/").toLowerCase();

      if (excluded.endsWith("/")) {
        return candidates.some((c) => c.startsWith(excluded));
      }

      return candidates.some((c) => {
        return (
          c === excluded ||
          c.endsWith(`/${excluded}`) ||
          excluded.endsWith(`/${c}`)
        );
      });
    };

    if (hasTokenFields) {
      const tokenObj = obj as IMap;

      // --- check exclude list ---
      const excludeList =
        this.tokensParser.opts?.mapOptions?.excludeCSSVariables ?? [];
      const candidates = buildExcludeCandidates();

      let isExcluded = false;
      if (excludeList && excludeList.length > 0) {
        for (const excludedRaw of excludeList) {
          if (matchesExcluded(excludedRaw, candidates)) {
            isExcluded = true;
            break;
          }
        }
      }

      // --- determine whether we must export this token as CSS var ---
      const globalMapFlag =
        this.tokensParser.opts?.mapOptions?.convertToCSSVariables ?? false;
      const localMapFlag = opts?.convertToCSSVariables ?? false;
      const shouldExportAsVar =
        !isExcluded &&
        (Boolean(tokenObj.meta?.build?.web?.exportAsVar) ||
          Boolean(localMapFlag) ||
          Boolean(globalMapFlag));

      if (shouldExportAsVar && tokenObj.value !== undefined) {
        const explicitVarName = tokenObj.meta?.build?.web?.varName;
        const pathPart = path.filter(Boolean).join("-");
        const filePart = opts.fileName
          ? opts.convertCase
            ? this.tokensParser.toKebabCase(opts.fileName)
            : opts.fileName
          : "";

        let computedNameSource = explicitVarName
          ? explicitVarName
          : pathPart || (filePart ? `${filePart}` : "");

        // --- includeFileNameToCSSVariables ---
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
          computedNameSource && computedNameSource.startsWith("--")
            ? computedNameSource
            : `--${computedNameSource || opts.fileName || "token"}`;

        const localOpts: ParseValueOptions = {
          ...opts,
          key: typeof tokenObj.type === "string" ? tokenObj.type : opts.key,
          unit:
            Object.prototype.hasOwnProperty.call(tokenObj, "unit") &&
            typeof tokenObj.unit === "string"
              ? (tokenObj.unit as string)
              : opts.unit,
        };

        let cssValue: string | undefined;
        if (_.isPlainObject(tokenObj.value) || Array.isArray(tokenObj.value)) {
          cssValue = this.parseMap(tokenObj.value, localOpts, [
            ...path,
            "value",
          ]);
        } else {
          cssValue = this.normalizeValue(tokenObj.value, localOpts);
        }

        if (cssValue !== undefined && cssValue !== "undefined") {
          this.collectedCssVars.push(`  ${varName}: ${cssValue};`);
        }
      }

      // --- reflect original structure into SCSS map ---
      if (useReflect) {
        const parts: string[] = [];

        // value
        if (tokenObj.value !== undefined) {
          if (_.isPlainObject(tokenObj.value)) {
            parts.push(
              `value: ${this.parseMap(tokenObj.value, opts, [
                ...path,
                "value",
              ])}`
            );
          } else if (Array.isArray(tokenObj.value)) {
            parts.push(
              `value: ${this.parseList(tokenObj.value as any[], opts)}`
            );
          } else {
            const localOpts: ParseValueOptions = {
              ...opts,
              key: typeof tokenObj.type === "string" ? tokenObj.type : opts.key,
              unit:
                Object.prototype.hasOwnProperty.call(tokenObj, "unit") &&
                typeof tokenObj.unit === "string"
                  ? (tokenObj.unit as string)
                  : opts.unit,
            };
            parts.push(
              `value: ${this.normalizeValue(tokenObj.value, localOpts)}`
            );
          }
        }

        // type / unit always treated as scalar fields (if present)
        if (tokenObj.type !== undefined) {
          let parsed = this.normalizeValue(tokenObj.type, opts);
          parsed = `"${parsed}"`;
          parts.push(`type: ${parsed}`);
        }
        if (tokenObj.unit !== undefined) {
          let parsed = this.normalizeValue(tokenObj.unit, opts);
          parsed = `"${parsed}"`;
          parts.push(`unit: ${parsed}`);
        }

        // description: include only if it's NOT a nested object.
        // if it's a plain object, we will handle it below as an "extra key" (nested token).
        if (
          tokenObj.description !== undefined &&
          !_.isPlainObject(tokenObj.description)
        ) {
          let parsed = this.normalizeValue(tokenObj.description, opts);
          parsed = `"${parsed}"`;
          parts.push(`description: ${parsed}`);
        }

        // meta: serialize explicitly and remove description inside meta (serializeMeta already does that)
        if (tokenObj.meta !== undefined) {
          const serializedMeta = this.serializeMeta(tokenObj.meta, opts, [
            ...path,
            "meta",
          ]);
          parts.push(`meta: ${serializedMeta}`);
        }

        // extra keys: exclude tokens fields already handled; treat description as extra key
        // only if it was a nested object (we didn't emit it above).
        const extraKeys = keys.filter((k) => {
          if (["value", "type", "unit", "meta"].includes(k)) return false;
          if (k === "description") {
            // include description only if it's a nested object (a token), otherwise already handled
            return _.isPlainObject((map as IMap)[k]);
          }
          return true;
        });

        for (const extraKey of extraKeys) {
          const kebabKey = opts.convertCase
            ? this.tokensParser.toKebabCase(extraKey)
            : extraKey;
          const value = this.parseMap(
            (map as IMap)[extraKey] as Value<object>,
            opts,
            [...path, kebabKey]
          );
          parts.push(`${kebabKey}: ${value}`);
        }

        return `(\n  ${parts.join(",\n  ")}\n)`;
      } else {
        // not reflecting original structure
        if (tokenObj.value === undefined) {
          // When value is undefined we treat object as container of nested tokens.
          // IMPORTANT: don't unconditionally exclude "description" here — exclude it only when
          // it's a scalar token field (not a nested token object). This fixes the bug
          // where a nested token named "description" was previously dropped.
          const nestedParts: string[] = [];
          const subKeys = keys.filter((k) => {
            // always skip token scalar fields
            if (["type", "unit", "meta"].includes(k)) return false;
            if (k === "description") {
              // if description is a scalar (string/number) it's a field and must be skipped;
              // but if it's a plain object — it's a nested token and must be kept.
              return _.isPlainObject((map as IMap)[k]);
            }
            return true;
          });

          for (const subKey of subKeys) {
            const kebabKey = opts.convertCase
              ? this.tokensParser.toKebabCase(subKey)
              : subKey;
            const value = this.parseMap((map as IMap)[subKey] as any, opts, [
              ...path,
              kebabKey,
            ]);
            nestedParts.push(`${kebabKey}: ${value}`);
          }

          // include meta (but without meta.description) if present
          if ((map as any).meta !== undefined && !subKeys.includes("meta")) {
            // if meta exists as scalar or object and not already processed, include serialized meta
            const serializedMeta = this.serializeMeta((map as any).meta, opts, [
              ...path,
              "meta",
            ]);
            nestedParts.push(`meta: ${serializedMeta}`);
          }

          return `(\n  ${nestedParts.join(",\n  ")}\n)`;
        }

        // token has a value -> return final normalized value
        const localOpts: ParseValueOptions = {
          ...opts,
          key: typeof tokenObj.type === "string" ? tokenObj.type : opts.key,
          unit:
            Object.prototype.hasOwnProperty.call(tokenObj, "unit") &&
            typeof tokenObj.unit === "string"
              ? (tokenObj.unit as string)
              : opts.unit,
        };

        if (_.isPlainObject(tokenObj.value)) {
          return this.parseMap(tokenObj.value, localOpts, [...path, "value"]);
        } else if (Array.isArray(tokenObj.value)) {
          return this.parseList(tokenObj.value as any[], localOpts);
        } else {
          return this.normalizeValue(tokenObj.value, localOpts);
        }
      }
    }

    // plain object (not a token)
    const nestedParts: string[] = [];
    for (const [k, v] of Object.entries(map as Record<string, any>)) {
      if (!this.tokensParser.isKeyValidated(k)) continue;
      const kebabKey = opts.convertCase ? this.tokensParser.toKebabCase(k) : k;

      // --- FIX: убираем description ТОЛЬКО внутри meta ---
      if (k === "description" && path[path.length - 1] === "meta") {
        continue;
      }

      const value = this.parseMap(v as any, opts, [...path, kebabKey]);
      nestedParts.push(`${kebabKey}: ${value}`);
    }
    return `(\n  ${nestedParts.join(",\n  ")}\n)`;
  }

  public getCssVarsBlock(): string {
    if (this.collectedCssVars.length === 0) return "";
    return `\n:root {\n${this.collectedCssVars.join("\n")}\n}\n`;
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

      mapOptions: {
        convertCase: opts.mapOptions?.convertCase ?? false,
        includeFileName: opts.mapOptions?.includeFileName ?? true,
        convertToCSSVariables: opts.mapOptions?.convertToCSSVariables ?? false,
        includeFileNameToCSSVariables:
          opts.mapOptions?.includeFileNameToCSSVariables ?? false,
        excludeCSSVariables: opts.mapOptions?.excludeCSSVariables ?? [],
      },

      builder: {
        format: "json",
        outDir: opts.builder?.outDir ?? opts.source,
        paths: opts.builder?.paths ?? opts.paths ?? ["."],
        includeRootDirName: opts.builder?.includeRootDirName ?? false,
        useTokensInSeparateFiles:
          opts.builder?.useTokensInSeparateFiles ?? true,
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

  async buildAndParse() {
    const builder = new JSONBuilder(this.opts.builder!);
    await builder.build();

    if (this.opts.source && this.opts.outDir) {
      await this.listDir(this.opts.source, this.opts.outDir);
    }

    await this.generateEntryFile();

    // --- THEMES ---
    if (this.opts.themesDir && this.opts.themesOutFile) {
      const includeRequired = this.opts.themesIncludeRequired ?? false;

      if (this.opts.themesDir.endsWith(".json")) {
        await this.generateThemesFromFile(
          this.opts.themesDir,
          this.opts.themesOutFile,
          includeRequired
        );
      } else {
        await this.generateThemesFromDir(
          this.opts.themesDir,
          this.opts.themesOutFile,
          includeRequired
        );
      }
    }
  }

  isKeyValidated(key: string): boolean {
    return /^[^$:].*/.test(key);
  }

  toKebabCase(key: string): string {
    return key
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
      .toLowerCase();
  }

  valuePxToRem(value: number): string {
    return `px2rem(${value}px)`;
  }

  convertNumberByKey(
    value: number,
    key?: string,
    opts?: ParseValueOptions
  ): string {
    if (opts && Object.prototype.hasOwnProperty.call(opts, "unit")) {
      const unitVal = (opts as any).unit;

      if (unitVal === "") {
        return `${value}`;
      }

      if (typeof unitVal === "string") {
        return `${value}${unitVal}`;
      }
    }

    if (["font-size", "line-height", "letter-spacing"].includes(key || "")) {
      return `${value}em`;
    }

    return opts?.convertPxToRem ? this.valuePxToRem(value) : `${value}px`;
  }

  normalizeValue(value: any, opts: ParseValueOptions): string {
    if (typeof value === "number") {
      return this.convertNumberByKey(value, opts.key, opts);
    }

    if (typeof value === "string") {
      if (value.startsWith("{")) {
        const nested = this.parseNestedValue(value, opts);
        return this.normalizeValue(nested, opts);
      }

      if (/^\d+(\.\d+)?$/.test(value)) {
        return this.convertNumberByKey(Number(value), opts.key, opts);
      }

      if (/^\d+(\.\d+)?(px|rem|em|%)$/.test(value)) {
        return value;
      }

      return value;
    }

    if (Array.isArray(value)) {
      return value.map((v) => this.normalizeValue(v, opts)).join(" ");
    }

    if (_.isPlainObject(value) && "value" in value) {
      const localOpts: ParseValueOptions = {
        ...opts,
        key:
          typeof (value as any).type === "string"
            ? (value as any).type
            : opts.key,
        unit:
          Object.prototype.hasOwnProperty.call(value, "unit") &&
          typeof (value as any).unit === "string"
            ? (value as any).unit
            : opts.unit,
      };
      return this.normalizeValue((value as any).value, localOpts);
    }

    return String(value);
  }

  parseNestedValue(
    value: string,
    opts: ParseValueOptions,
    depth = 0,
    visited = new Set<string>()
  ): any {
    if (depth > 5) return value;
    const regex = /{([^}]+)}/g;
    let result = value;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(result)) !== null) {
      const fullMatch = match[0];
      const pathStr = match[1];

      if (visited.has(fullMatch)) {
        console.warn(`⚠️ Circular reference detected: ${fullMatch}`);
        continue;
      }

      visited.add(fullMatch);

      const pathParts = pathStr.split(".");
      const fileName = pathParts.shift();
      if (!fileName) {
        visited.delete(fullMatch);
        continue;
      }

      let json;
      if (this.fileCache[fileName]) {
        json = this.fileCache[fileName];
      } else {
        const paths = this.opts.paths ?? ["."];
        let fileFound = false;
        for (const p of paths) {
          const filePath = `${p}/${fileName}.json`;
          try {
            json = JSON.parse(readFileSync(filePath, "utf-8"));
            this.fileCache[fileName] = json;
            fileFound = true;
            break;
          } catch {}
        }

        if (!fileFound) {
          console.warn(
            `⚠️ Token file "${fileName}.json" not found in paths: ${paths.join(
              ", "
            )}`
          );
          visited.delete(fullMatch);
          continue;
        }
      }

      let nestedValue = pathParts.reduce((acc, key) => acc?.[key], json);
      if (nestedValue === undefined) {
        console.warn(
          `⚠️ Token path "${pathStr}" not found in file "${fileName}"`
        );
        visited.delete(fullMatch);
        continue;
      }

      if (typeof nestedValue === "string" && nestedValue.startsWith("{")) {
        nestedValue = this.parseNestedValue(
          nestedValue,
          opts,
          depth + 1,
          visited
        );
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
    opts?: ParseValueOptions
  ): string[] {
    const useOpts = opts ?? this.defaultVarsOptions;

    if (_.isPlainObject(obj) && "value" in obj) {
      const flatPath =
        useOpts.includeFileName && useOpts.fileName
          ? [
              useOpts.convertCase
                ? this.toKebabCase(useOpts.fileName!)
                : useOpts.fileName!,
              ...path,
            ]
          : path;

      const cssVarName = `--${flatPath.join("-")}`;
      const finalValue =
        obj.value !== undefined
          ? this.parser.parseValue(obj.value, useOpts)
          : "initial";

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

  // --- Theming --- //

  async writeCSSFile(filePath: string, cssContent: string) {
    await fs.mkdir(nodePath.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, cssContent, "utf-8");
  }

  async generateThemesFromDir(
    inputDir: string,
    outputPath: string,
    includeRequired: boolean
  ): Promise<void> {
    const files = await fs.readdir(inputDir);
    const themes: Record<string, any> = {};

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const themeName = nodePath.basename(file, ".json");
      const raw = await fs.readFile(nodePath.join(inputDir, file), "utf-8");
      themes[themeName] = JSON.parse(raw);
    }

    const css = this.generateThemesBlockFromObject(themes, includeRequired);
    await fs.mkdir(nodePath.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, css, "utf-8");
  }

  async generateThemesFromFile(
    inputPath: string,
    outputPath: string,
    includeRequired: boolean
  ): Promise<void> {
    const raw = await fs.readFile(inputPath, "utf-8");
    const themes = JSON.parse(raw);

    const css = this.generateThemesBlockFromObject(themes, includeRequired);
    await fs.mkdir(nodePath.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, css, "utf-8");
  }

  generateThemesBlockFromObject(
    themes: Record<string, any>,
    includeRequired: boolean
  ): string {
    // helper: serialize a single theme object into array of css var lines
    const collectVarsFromTheme = (themeObj: any, prefixPath: string[] = []) => {
      const vars: string[] = [];

      const walk = (obj: any, path: string[] = []) => {
        if (_.isPlainObject(obj) && "value" in obj) {
          const exportAsVar = obj.meta?.build?.web?.exportAsVar ?? false;

          if (!includeRequired || exportAsVar) {
            const cssVarName = `--${[...prefixPath, ...path].join("-")}`;
            vars.push(
              `${cssVarName}: ${this.parser.parseValue(
                obj.value,
                this.defaultVarsOptions
              )}`
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

    let css = "";

    // If the root object is a wrapper (like { "themes": { "light": {...}, "dark": {...} } })
    // detect that and "unwrap" one level so we generate proper selectors for inner keys.
    const rootKeys = Object.keys(themes);
    if (rootKeys.length === 1) {
      const onlyKey = rootKeys[0];
      const onlyVal = themes[onlyKey];
      // if the only value is a plain object whose direct children look like theme objects (map of names -> objects),
      // and those children do not themselves contain "value" directly, treat it as wrapper and unwrap.
      if (
        _.isPlainObject(onlyVal) &&
        Object.keys(onlyVal).length > 0 &&
        Object.values(onlyVal).every((v) => _.isPlainObject(v))
      ) {
        // unwrap
        themes = onlyVal as Record<string, any>;
      }
    }

    for (const [rawThemeName, themeObj] of Object.entries(themes)) {
      if (!_.isPlainObject(themeObj)) continue;

      const themeName = this.toKebabCase(rawThemeName);

      // collect vars for this theme
      const vars = collectVarsFromTheme(themeObj);

      if (vars.length === 0) {
        // skip empty theme
        continue;
      }

      css += `\n[data-theme="${themeName}"] {\n  ${vars.join("\n  ")}\n}\n`;
    }

    return css;
  }

  // --- JSONToSCSS ---
  async JSONToSCSS(
    inputPath: string,
    outputDir: string,
    outputFileName: string,
    opts?: Partial<JSONToSCSSOptions>
  ): Promise<void> {
    const {
      header = "// Generated by tokensParser. ‼️ DO NOT MODIFY THIS FILE ‼️ /\n",
      name = "",
      comment = "",
      options,
      mapOptions,
      varsOptions,
    } = { ...(opts || {}) } as JSONToSCSSOptions;

    const baseOptions: ParseValueOptions = {
      ...this.defaultParseOptions,
      fileName: options?.fileName || "",
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

      const data = await fs.readFile(inputPath, "utf-8");
      const json = JSON.parse(data);

      let content = `${header}\n${comment}\n`;

      const topLevelKey =
        parseMapOptions.includeFileName && parseMapOptions.fileName
          ? parseMapOptions.convertCase
            ? this.toKebabCase(parseMapOptions.fileName)
            : parseMapOptions.fileName
          : "";

      const rootMap =
        parseMapOptions.includeFileName && parseMapOptions.fileName
          ? { [topLevelKey]: json }
          : json;

      // --- Clear previously collected CSS variables (so they are not duplicated between files) ---
      if (this.parser instanceof SCSSParser) {
        this.parser.clearCssVars();
      }

      // --- SCSS maps ---
      for (const [k, v] of Object.entries(rootMap)) {
        const kebabKey = parseMapOptions.convertCase ? this.toKebabCase(k) : k;
        const keyLine = `$${kebabKey}:`;
        const map = v as IMap;

        // --- IMPORTANT: pass initial path = [kebabKey] so that the prefix is ​​preserved ---
        // if kebabKey is empty (unlikely), pass fileName as fallback
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

        const str = `${keyLine}${this.parser.parseMap(
          map,
          parseMapOptions,
          initialPath
        )};`;
        content += `${str}\n`;
      }

      // --- CSS vars from exportAsVar (or convertToCSSVariables) ---
      if (this.parser instanceof SCSSParser) {
        const cssVarsBlock = this.parser.getCssVarsBlock();
        if (cssVarsBlock) {
          content += cssVarsBlock;
        }
      }

      // --- All to CSS vars" (legacy)
      if (parseVarsOptions.convertToCSSVariables) {
        const flatVars = this.flattenToCSSVariables(
          json,
          [],
          [],
          parseVarsOptions
        );
        const cssContent = `:root {\n  ${flatVars.join("\n  ")}\n}`;
        if (this.opts.cssVarsOutDir) {
          const cssOutPath = `${this.opts.cssVarsOutDir}/${parseVarsOptions.fileName}.css`;
          await fs.writeFile(cssOutPath, cssContent);
          console.log(`CSS variables written to ${cssOutPath}`);
        } else {
          content += `\n${cssContent}\n`;
        }
      }

      // --- write file ---
      await fs.writeFile(outputPath, content);
      console.log(`${name} parsed to ${outputPath}`);
    } catch (err) {
      console.error(err);
    }
  }

  // --- listDir (was missing previously) ---
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
            `_${fileName.replace(".json", ".scss")}`,
            {
              options: {
                ...this.defaultParseOptions,
                fileName: fileName.replace(/\.json$/, ""),
              },
              mapOptions: this.defaultMapOptions,
              varsOptions: this.defaultVarsOptions,
              name: fileName.replace(".json", ""),
            }
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async resolveAndSaveJson(
    inputPath: string,
    fileName: string
  ): Promise<void> {
    if (!this.opts.build) return;
    const unresolvedTokens: string[] = [];
    try {
      const jsonRaw = await fs.readFile(inputPath, "utf-8");
      const json = JSON.parse(jsonRaw);

      const resolveRecursive = (
        obj: any,
        opts: ParseValueOptions,
        depth = 0
      ): any => {
        if (_.isString(obj)) {
          const regex = /{([^}]+)}/g;
          let result: any = obj;
          let match: RegExpExecArray | null;
          while ((match = regex.exec(obj)) !== null) {
            const fullMatch = match[0];
            const pathStr = match[1];
            const pathParts = pathStr.split(".");
            const fileName = pathParts.shift();
            if (!fileName) continue;

            try {
              let json: any;

              if (this.fileCache[fileName]) {
                json = this.fileCache[fileName];
              } else {
                const paths = this.opts.paths ?? ["."];
                let fileFound = false;

                for (const p of paths) {
                  const filePath = `${p}/${fileName}.json`;
                  try {
                    const file = readFileSync(filePath, "utf-8");
                    json = JSON.parse(file);
                    this.fileCache[fileName] = json;
                    fileFound = true;
                    break;
                  } catch {
                    continue;
                  }
                }

                if (!fileFound) {
                  unresolvedTokens.push(fullMatch);
                  continue;
                }
              }

              let nestedValue = pathParts.reduce(
                (acc, key) => acc?.[key],
                json
              );
              if (nestedValue === undefined) {
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
          return result;
        }

        if (_.isArray(obj))
          return obj.map((v) => resolveRecursive(v, opts, depth));
        if (_.isPlainObject(obj))
          return Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [
              k,
              resolveRecursive(v, opts, depth),
            ])
          );
        return obj;
      };

      const resolvedJson = resolveRecursive(json, {
        ...this.defaultParseOptions,
        fileName: fileName.replace(/\.json$/, ""),
      });

      const buildDir = this.opts.build!;
      if (
        !(await fs
          .access(buildDir)
          .then(() => true)
          .catch(() => false))
      )
        await fs.mkdir(buildDir, { recursive: true });
      const buildPath = `${buildDir}/${fileName}`;
      await fs.writeFile(
        buildPath,
        JSON.stringify(resolvedJson, null, 2),
        "utf-8"
      );

      if (unresolvedTokens.length > 0) {
        const logPath = `${buildDir}/unresolved-tokens.log`;
        const uniqueTokens = [...new Set(unresolvedTokens)];
        await fs.writeFile(logPath, uniqueTokens.join("\n"), "utf-8");
        console.warn("Unresolved tokens saved to", logPath);
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
      const jsonFiles = files.filter((f: string) => f.endsWith(".json"));

      const relativeImportPath = nodePath.relative(
        nodePath.dirname(entryFilePath),
        build
      );

      const imports = jsonFiles
        .map((file: string) => {
          const name = file.replace(".json", "");
          let importPath = nodePath
            .join(relativeImportPath, file)
            .replace(/\\/g, "/");
          if (!importPath.startsWith(".") && !importPath.startsWith("/"))
            importPath = "./" + importPath;
          return `import ${name} from "${importPath}";`;
        })
        .join("\n");

      const spreadList = jsonFiles
        .map((file: string) => file.replace(".json", ""))
        .join(", ");

      const content = `${imports}\n\nconst module = {\n  ${spreadList
        .split(", ")
        .map((name: string) => `...${name}`)
        .join(",\n  ")}\n};\n\nexport default module;\n`;

      const entryDir = nodePath.dirname(entryFilePath);
      await fs.mkdir(entryDir, { recursive: true });
      await fs.writeFile(entryFilePath, content, "utf-8");
      console.log(`✅ TypeScript entry file generated at ${entryFilePath}`);
    } catch (err) {
      console.error("❌ Failed to generate TypeScript entry file", err);
    }
  }

  // --- Resolve links in file structure --- //

  private async resolveTokenPathRecursive(pathStr: string): Promise<any> {
    const pathParts = pathStr.split(".");

    const tryResolve = async (
      currentParts: string[],
      currentDir: string
    ): Promise<any> => {
      if (currentParts.length === 0) return undefined;

      const fileName = `${currentParts[0]}.json`;
      const filePath = nodePath.join(currentDir, fileName);
      if (await this.isFile(filePath)) {
        const content = JSON.parse(await fs.readFile(filePath, "utf-8"));
        if (currentParts.length === 1) return content;
        return this.getNestedValue(content, currentParts.slice(1));
      }

      const dirPath = nodePath.join(currentDir, currentParts[0]);
      if (await this.isDir(dirPath)) {
        return tryResolve(currentParts.slice(1), dirPath);
      }

      for (let i = currentParts.length; i > 0; i--) {
        const joinedFile = nodePath.join(
          currentDir,
          currentParts.slice(0, i).join("/") + ".json"
        );
        if (await this.isFile(joinedFile)) {
          const content = JSON.parse(await fs.readFile(joinedFile, "utf-8"));
          return this.getNestedValue(content, currentParts.slice(i));
        }
      }

      return undefined;
    };

    for (const rootPath of this.opts.paths ?? ["./"]) {
      const absRoot = nodePath.resolve(rootPath);
      const res = await tryResolve(pathParts, absRoot);
      if (res !== undefined) return res;
    }

    console.warn(`⚠️ Token path "${pathStr}" could not be resolved.`);
    return undefined;
  }

  private async isFile(p: string): Promise<boolean> {
    try {
      return (await fs.stat(p)).isFile();
    } catch {
      return false;
    }
  }

  private async isDir(p: string): Promise<boolean> {
    try {
      return (await fs.stat(p)).isDirectory();
    } catch {
      return false;
    }
  }

  private getNestedValue(obj: any, keys: string[]): any {
    return keys.reduce((acc, k) => acc?.[k], obj);
  }
}
