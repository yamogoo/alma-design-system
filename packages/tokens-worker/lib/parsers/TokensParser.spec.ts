// Portions of this file were developed with the assistance of AI tools.
//
// @ts-nocheck

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { TokensParser, SCSSParser } from './TokensParser';

const BASE_PARSE_OPTIONS = {
  convertPxToRem: false,
  convertCase: false,
  includeFileName: false,
};

const createParser = (overrides = {}) =>
  new TokensParser({
    outDir: 'dist',
    ...overrides,
  });

const createExportableToken = (value: any, extraMeta: Record<string, any> = {}) => ({
  value,
  type: 'number',
  unit: 'px',
  meta: {
    build: {
      web: {
        exportAsVar: true,
        ...extraMeta,
      },
    },
  },
});

describe('TokensParser / SCSSParser options matrix', () => {
  it('respects includeServiceFields and includeSymbolsInServiceFields flags', () => {
    const baseToken = {
      value: 12,
      type: 'number',
      unit: 'px',
    };

    const parserNoSymbols = createParser({
      mapOptions: {
        includeServiceFields: true,
        includeSymbolsInServiceFields: false,
      },
    });
    const scssNoSymbols = parserNoSymbols.parser as SCSSParser;
    scssNoSymbols.clearCssVars();

    const resultNoSymbols = scssNoSymbols.parseMap(
      baseToken as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: false,
      },
      ['root', 'gap'],
    );
    expect(resultNoSymbols).toContain('value: 12px');
    expect(resultNoSymbols).not.toContain('$value');

    const parserWithSymbols = createParser({
      mapOptions: {
        includeServiceFields: true,
        includeSymbolsInServiceFields: true,
      },
    });
    const scssWithSymbols = parserWithSymbols.parser as SCSSParser;
    const resultWithSymbols = scssWithSymbols.parseMap(
      baseToken as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: false,
      },
      ['root', 'gap'],
    );
    expect(resultWithSymbols).toContain('$value: 12px');
  });

  it('converts keys to kebab-case when convertCase is enabled', () => {
    const parser = createParser();
    const scssParser = parser.parser as SCSSParser;
    const data = {
      textAlign: 'center',
    };

    const out = scssParser.parseMap(
      data as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertCase: true,
      },
      ['typography'],
    );

    expect(out).toContain('text-align: center');
  });

  it('collects CSS variables with file name and prefixes applied', () => {
    const parser = createParser({
      cssVarOptions: {
        convertToCSSVariables: true,
        includeFileNameToCSSVariables: true,
        prefix: 'ds',
      },
    });
    const scssParser = parser.parser as SCSSParser;
    scssParser.clearCssVars();

    const token = createExportableToken(16);
    scssParser.parseMap(
      token as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
        fileName: 'layout',
      },
      ['root', 'padding'],
    );

    const cssBlock = scssParser.getCssVarsBlock();
    expect(cssBlock).toContain('--ds-layout-root-padding: 16px;');
  });

  it('avoids collecting CSS variables when excluded by options', () => {
    const parser = createParser({
      cssVarOptions: {
        convertToCSSVariables: true,
        excludeCSSVariables: ['layout.json'],
      },
    });
    const scssParser = parser.parser as SCSSParser;
    scssParser.clearCssVars();

    const token = createExportableToken(20);
    scssParser.parseMap(
      token as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
        fileName: 'layout',
      },
      ['root', 'padding'],
    );

    expect(scssParser.getCssVarsBlock()).toBe('');
  });

  it('honours cssVarsPrefer option when resolving conflicts', () => {
    const firstParser = createParser({
      cssVarsPrefer: 'first',
      cssVarOptions: {
        convertToCSSVariables: true,
      },
    });
    const firstScss = firstParser.parser as SCSSParser;
    firstScss.clearCssVars();

    const tokenA = createExportableToken(10);
    const tokenB = createExportableToken(20);

    firstScss.parseMap(
      tokenA as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
        fileName: 'layout',
      },
      ['root', 'padding'],
    );
    firstScss.parseMap(
      tokenB as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
        fileName: 'layout',
      },
      ['root', 'padding'],
    );

    expect(firstScss.getCssVarsBlock()).toContain('--root-padding: 10px;');

    const lastParser = createParser({
      cssVarsPrefer: 'last',
      cssVarOptions: {
        convertToCSSVariables: true,
      },
    });
    const lastScss = lastParser.parser as SCSSParser;
    lastScss.clearCssVars();

    lastScss.parseMap(
      tokenA as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
      },
      ['root', 'padding'],
    );
    lastScss.parseMap(
      tokenB as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
      },
      ['root', 'padding'],
    );

    expect(lastScss.getCssVarsBlock()).toContain('--root-padding: 20px;');
  });

  it('applies mapOptions prefix when no cssVarOptions prefix provided', () => {
    const parser = createParser({
      mapOptions: {
        prefix: 'theme',
      },
      cssVarOptions: {
        convertToCSSVariables: true,
      },
    });
    const scssParser = parser.parser as SCSSParser;
    scssParser.clearCssVars();

    const token = createExportableToken('#fff');
    scssParser.parseMap(
      token as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
      },
      ['root', 'background'],
    );

    const css = scssParser.getCssVarsBlock();
    expect(css).toContain('--theme-root-background: #ffffff;');
  });

  it('prefers mapOptions prefix over cssVarOptions prefix', () => {
    const parser = createParser({
      mapOptions: {
        prefix: 'theme',
      },
      cssVarOptions: {
        prefix: 'runtime',
        convertToCSSVariables: true,
      },
    });
    const scssParser = parser.parser as SCSSParser;
    scssParser.clearCssVars();

    const token = createExportableToken('#000');
    scssParser.parseMap(
      token as any,
      {
        ...BASE_PARSE_OPTIONS,
        convertToCSSVariables: true,
      },
      ['root', 'background'],
    );

    const css = scssParser.getCssVarsBlock();
    expect(css).toContain(':root');
    expect(css).toContain('--theme-root-background: #000000;');
    expect(css).not.toContain('--runtime-root-background');
  });

  it('converts numbers with convertPxToRem, explicit unit, and defaults', () => {
    const parser = createParser();

    expect(parser.convertNumberByKey(8, undefined, { convertPxToRem: true })).toBe('px2rem(8px)');
    expect(
      parser.convertNumberByKey(6, undefined, {
        convertPxToRem: false,
        unit: 'rem',
      }),
    ).toBe('6rem');
    expect(
      parser.convertNumberByKey(5, undefined, {
        convertPxToRem: false,
        unit: '',
      }),
    ).toBe('5');
  });

  it('joins list values via parseList helper', () => {
    const parser = createParser();
    const scssParser = parser.parser as SCSSParser;
    const out = scssParser.parseList(['12px', '14px', '16px'], BASE_PARSE_OPTIONS);
    expect(out).toBe('12px 14px 16px');
  });

  it('resolves nested token references through file cache', () => {
    const parser = createParser({ paths: [] });
    parser.fileCache.tokens = {
      spacing: {
        md: {
          value: '24px',
        },
      },
    };

    const resolved = parser.parseNestedValue('{tokens.spacing.md.value}', {
      ...BASE_PARSE_OPTIONS,
    });

    expect(resolved).toBe('24px');
  });

  it('resolves nested references via folder structure lookup', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-parser-'));
    try {
      const targetFile = path.join(tmp, 'themes', 'light', 'surface.json');
      fs.mkdirSync(path.dirname(targetFile), { recursive: true });
      fs.writeFileSync(
        targetFile,
        JSON.stringify({
          neutral: {
            value: '#abcdef',
          },
        }),
        'utf8',
      );

      const parser = createParser({
        paths: [tmp],
        useFileStructureLookup: true,
      });

      const resolved = parser.parseNestedValue(
        '{themes.light.surface.neutral.value}',
        BASE_PARSE_OPTIONS,
      );

      expect(resolved).toBe('#abcdef');
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
