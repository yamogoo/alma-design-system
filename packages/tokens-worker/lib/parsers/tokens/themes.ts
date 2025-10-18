// This file were developed with the assistance of AI tools.
//
import fs from 'node:fs/promises';
import nodePath from 'node:path';

import * as _ from 'lodash-es';

import type { ParseValueOptions, TokensParserOptions } from './types.js';
import type { TokenResolver } from './core/resolver.js';
import { SCSSParser } from './emit/scss.js';

interface ThemeGeneratorConfig {
  opts: TokensParserOptions;
  resolver: TokenResolver;
  parser: SCSSParser;
  defaultParseOptions: ParseValueOptions;
  toKebabCase(value: string): string;
}

export class ThemeGenerator {
  private readonly opts: TokensParserOptions;
  private readonly resolver: TokenResolver;
  private readonly parser: SCSSParser;
  private readonly defaultParseOptions: ParseValueOptions;
  private readonly toKebabCaseFn: (value: string) => string;

  constructor({ opts, resolver, parser, defaultParseOptions, toKebabCase }: ThemeGeneratorConfig) {
    this.opts = opts;
    this.resolver = resolver;
    this.parser = parser;
    this.defaultParseOptions = defaultParseOptions;
    this.toKebabCaseFn = toKebabCase;
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
    const collectVarsFromTheme = (themeObj: any, prefixPath: string[] = []) => {
      const vars: string[] = [];

      const walk = (obj: any, path: string[] = []) => {
        if (_.isPlainObject(obj) && this.resolver.hasTokenField(obj, 'value')) {
          const meta = this.resolver.getTokenField(obj, 'meta');
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
            const rawVal = this.resolver.getTokenField(obj, 'value');
            const rendered = (this.parser.parseValue as any)(rawVal, this.defaultParseOptions);
            vars.push(`${cssVarName}: ${rendered}`);
          }
          return;
        }

        if (_.isPlainObject(obj)) {
          for (const [k, v] of Object.entries(obj)) {
            walk(v, [...path, this.toKebabCaseFn(k)]);
          }
        }
      };

      walk(themeObj);
      return vars;
    };

    let css = '';

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

      const themeName = this.toKebabCaseFn(rawThemeName);
      const vars = collectVarsFromTheme(themeObj);
      if (vars.length === 0) continue;

      css += `\n[data-theme="${themeName}"] {\n  ${vars.join('\n  ')}\n}\n`;
    }

    return css;
  }
}
