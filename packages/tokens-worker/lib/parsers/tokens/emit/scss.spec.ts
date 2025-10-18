// This file were developed with the assistance of AI tools.
//
import { describe, it, expect, beforeEach } from 'vitest';

import { SCSSParser } from './scss.js';
import type { SCSSParserContext } from './scss.js';
import type { ParseValueOptions } from '../types.js';

const BASE_PARSE_OPTS: ParseValueOptions = {
  convertPxToRem: false,
  convertCase: false,
  includeFileName: false,
};

const createContext = (override?: Partial<SCSSParserContext>): SCSSParserContext => {
  const resolverStub = {
    hasTokenField: (obj: any, name: any) => obj?.[name] !== undefined,
    getTokenField: <T>(obj: any, name: any): T | undefined => obj?.[name] ?? obj?.[`$${name}`],
    getField: <T>(obj: any, name: any): T | undefined => obj?.[name] ?? obj?.[`$${name}`],
    hasField: (obj: any, name: any) => obj?.[name] !== undefined || obj?.[`$${name}`] !== undefined,
  } as any;

  const context: SCSSParserContext = {
    opts: {
      outDir: '.tmp',
      build: '.tmp',
      source: '.tmp',
      paths: [],
      mapOptions: { prefix: '', includeServiceFields: [] },
      cssVarOptions: { prefix: '' },
    },
    cssVarsPrefer: 'last',
    resolver: resolverStub,
    defaultParseOptions: BASE_PARSE_OPTS,
    convertNumberByKey: (value: number, key?: string, opts?: ParseValueOptions) => {
      if (opts?.unit) {
        if (opts.unit === '') return `${value}`;
        return `${value}${opts.unit}`;
      }
      return `${value}px`;
    },
    tryParseColor: (value: string) => (value.startsWith('#') ? value : null),
    parseNestedValue: (value: string) => value.replace('{alias}', '#ffffff'),
    resolveIncludeServiceFields: () => ({ includeAll: false, set: new Set(['value', 'meta']) }),
    toKebabCase: (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
    isKeyValid: () => true,
    verbose: false,
    ...override,
  };

  return context;
};

describe('SCSSParser', () => {
  let parser: SCSSParser;

  beforeEach(() => {
    parser = new SCSSParser(createContext());
    parser.clearCssVars();
  });

  it('serialises token objects into service maps', () => {
    const token = {
      value: 16,
      type: 'dimension',
      unit: 'px',
      meta: { description: 'base spacing' },
    };

    const map = parser.parseMap(token, BASE_PARSE_OPTS, ['spacing', 'md']);
    expect(map).toContain('value: 16px');
    expect(map).toContain('meta:');
  });

  it('collects CSS variables when export flags are set', () => {
    const ctx = createContext({
      opts: {
        outDir: '.tmp',
        build: '.tmp',
        source: '.tmp',
        paths: [],
        mapOptions: { prefix: 'ds', includeServiceFields: [] },
        cssVarOptions: { prefix: 'ds' },
      },
    });
    const customParser = new SCSSParser(ctx);
    customParser.clearCssVars();

    const token = {
      value: '#ffffff',
      meta: {
        build: {
          web: {
            exportAsVar: true,
          },
        },
      },
    };

    customParser.parseMap(
      token,
      { ...BASE_PARSE_OPTS, convertToCSSVariables: true, fileName: 'color' },
      ['surface', 'background'],
    );

    const css = customParser.getCssVarsBlock();
    expect(css).toContain('--ds-surface-background: #ffffff;');
  });

  it('converts keys to kebab-case and respects convertCase option', () => {
    const data = {
      headerStyle: {
        value: 'bold',
      },
    };

    const out = parser.parseMap(data, { ...BASE_PARSE_OPTS, convertCase: true }, ['typography']);

    expect(out).toContain('header-style');
  });
});
