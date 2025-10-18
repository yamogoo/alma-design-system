// Portions of this file were developed with the assistance of AI tools.

import nodePath from 'node:path';

import { JSONBuilder, type JSONBuilderOptions } from './JSONBuilder.js';
import { SCSSParser } from './tokens/emit/scss.js';
import { TokenResolver } from './tokens/core/resolver.js';
import { ColorToolkit } from './tokens/core/color.js';
import { TokenFileManager } from './tokens/io/fs.js';
import { ThemeGenerator } from './tokens/themes.js';
import type { ParseValueOptions, TokensParserOptions } from './tokens/types.js';

export { SCSSParser } from './tokens/emit/scss.js';

export class TokensParser {
  public readonly parser: SCSSParser;
  public readonly opts: TokensParserOptions;
  public readonly defaultParseOptions: ParseValueOptions;
  public readonly defaultMapOptions: ParseValueOptions;

  private readonly fileCache: Record<string, any> = {};
  private readonly resolver: TokenResolver;
  private readonly colors: ColorToolkit;
  private readonly files: TokenFileManager;
  private readonly themes: ThemeGenerator;

  constructor(opts: TokensParserOptions) {
    const withDefaults = this.applyDefaults(opts);

    this.opts = withDefaults;

    this.defaultParseOptions = {
      convertCase: false,
      convertPxToRem: false,
      convertToCSSVariables: false,
      includeFileName: false,
      ...(withDefaults.parseOptions ?? {}),
    };

    this.defaultMapOptions = {
      ...this.defaultParseOptions,
      ...withDefaults.mapOptions,
      prefix: withDefaults.mapOptions?.prefix ?? '',
    };

    this.resolver = new TokenResolver({
      opts: withDefaults,
      fileCache: this.fileCache,
      defaultParseOptions: this.defaultParseOptions,
      verbose: withDefaults.verbose ?? false,
      globalInclude: withDefaults.mapOptions?.includeServiceFields,
      useFileStructureLookup: withDefaults.useFileStructureLookup,
    });

    this.colors = new ColorToolkit({
      resolver: this.resolver,
      defaultParseOptions: this.defaultParseOptions,
      verbose: withDefaults.verbose ?? false,
    });

    this.parser = new SCSSParser({
      opts: withDefaults,
      cssVarsPrefer: withDefaults.cssVarsPrefer ?? 'last',
      resolver: this.resolver,
      defaultParseOptions: this.defaultParseOptions,
      convertNumberByKey: this.convertNumberByKey.bind(this),
      tryParseColor: this.colors.tryParseColor.bind(this.colors),
      parseNestedValue: this.resolver.parseNestedValue.bind(this.resolver),
      resolveIncludeServiceFields: this.resolver.resolveIncludeServiceFields.bind(this.resolver),
      toKebabCase: this.toKebabCase.bind(this),
      isKeyValid: this.isKeyValidated.bind(this),
      verbose: withDefaults.verbose ?? false,
    });

    this.files = new TokenFileManager({
      opts: withDefaults,
      defaultParseOptions: this.defaultParseOptions,
      defaultMapOptions: this.defaultMapOptions,
      resolver: this.resolver,
      scssParser: this.parser,
      colors: this.colors,
      fileCache: this.fileCache,
      valuePxToRem: this.valuePxToRem.bind(this),
      convertNumberByKey: this.convertNumberByKey.bind(this),
      toKebabCase: this.toKebabCase.bind(this),
      verbose: withDefaults.verbose ?? false,
    });

    this.themes = new ThemeGenerator({
      opts: withDefaults,
      resolver: this.resolver,
      parser: this.parser,
      defaultParseOptions: this.defaultParseOptions,
      toKebabCase: this.toKebabCase.bind(this),
    });
  }

  private applyDefaults(options: TokensParserOptions): TokensParserOptions {
    const builderDefaults: JSONBuilderOptions = {
      format: 'json',
      outDir: options.builder?.outDir ?? options.source,
      paths: options.builder?.paths ?? options.paths ?? ['.'],
      includeRootDirName: options.builder?.includeRootDirName ?? false,
      useTokensInSeparateFiles: options.builder?.useTokensInSeparateFiles ?? true,
    };

    const mapDefaults = {
      prefix: options.mapOptions?.prefix ?? '',
      scssUseDefaultFlag: options.mapOptions?.scssUseDefaultFlag ?? true,
      convertCase: options.mapOptions?.convertCase ?? false,
      includeFileName: options.mapOptions?.includeFileName ?? true,
      convertToCSSVariables: options.mapOptions?.convertToCSSVariables ?? false,
      includeFileNameToCSSVariables: options.mapOptions?.includeFileNameToCSSVariables ?? false,
      excludeCSSVariables: options.mapOptions?.excludeCSSVariables ?? [],
      includeServiceFields: options.mapOptions?.includeServiceFields ?? [],
      includeSymbolsInServiceFields: options.mapOptions?.includeSymbolsInServiceFields ?? false,
    };

    const cssVarDefaults = {
      prefix: options.cssVarOptions?.prefix ?? options.mapOptions?.prefix ?? '',
      convertToCSSVariables:
        options.cssVarOptions?.convertToCSSVariables ??
        options.mapOptions?.convertToCSSVariables ??
        false,
      includeFileNameToCSSVariables:
        options.cssVarOptions?.includeFileNameToCSSVariables ??
        options.mapOptions?.includeFileNameToCSSVariables ??
        false,
      excludeCSSVariables:
        options.cssVarOptions?.excludeCSSVariables ?? options.mapOptions?.excludeCSSVariables ?? [],
      useSeparateFile: options.cssVarOptions?.useSeparateFile ?? false,
      fileNamePrefix: options.cssVarOptions?.fileNamePrefix ?? '_runtime.',
    };

    const fallbackBuild = nodePath.resolve(process.cwd(), 'build');

    return {
      ...options,
      verbose: options.verbose ?? false,
      cssVarsPrefer: options.cssVarsPrefer ?? 'last',
      isModulesMergedIntoEntry: options.isModulesMergedIntoEntry ?? true,
      mapOptions: mapDefaults,
      cssVarOptions: cssVarDefaults,
      builder: builderDefaults,
      build:
        typeof options.build === 'string' && options.build.trim().length > 0
          ? options.build
          : fallbackBuild,
    };
  }

  async buildAndParse(): Promise<void> {
    const builder = new JSONBuilder(this.opts.builder!);
    await builder.build();

    await this.files.ensureDirExists(this.opts.build);

    if (this.opts.source && this.opts.outDir) {
      await this.files.listDir(this.opts.source, this.opts.outDir);
    }

    await this.files.generateEntryFile();

    if (this.opts.themesDir && this.opts.themesOutFile) {
      const includeRequired = this.opts.themesIncludeRequired ?? false;

      if (this.opts.themesDir.endsWith('.json')) {
        await this.themes.generateThemesFromFile(
          this.opts.themesDir,
          this.opts.themesOutFile,
          includeRequired,
        );
      } else {
        await this.themes.generateThemesFromDir(
          this.opts.themesDir,
          this.opts.themesOutFile,
          includeRequired,
        );
      }
    }
  }

  /* Helper utilities shared across modules -------------------------------------------------- */

  public valuePxToRem(value: number): string {
    return `px2rem(${value}px)`;
  }

  public convertNumberByKey(value: number, key?: string, opts?: ParseValueOptions): string {
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

  public isKeyValidated(key: string): boolean {
    return /^[^$:].*/.test(key);
  }

  public toKebabCase(key: string): string {
    return key
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
      .toLowerCase();
  }

  public tryParseColor(value: string, unitForFormat?: string): string | null {
    return this.colors.tryParseColor(value, unitForFormat);
  }

  public parseNestedValue(
    value: string,
    opts: ParseValueOptions,
    depth = 0,
    visited: Set<string> = new Set(),
  ): string {
    return this.resolver.parseNestedValue(value, opts, depth, visited);
  }

  public resolveIncludeServiceFields(opts: ParseValueOptions) {
    return this.resolver.resolveIncludeServiceFields(opts);
  }
}
