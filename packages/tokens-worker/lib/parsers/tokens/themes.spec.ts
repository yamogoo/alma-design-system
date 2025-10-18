// Portions of this file were developed with the assistance of AI tools.
//
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { describe, it, expect, afterEach } from 'vitest';

import { ThemeGenerator } from './themes.js';
import { TokenResolver } from './core/resolver.js';
import { SCSSParser } from './emit/scss.js';
import type { ParseValueOptions, TokensParserOptions } from './types.js';

const TMP_PREFIX = path.join(os.tmpdir(), 'theme-generator-spec-');
const createdDirs: string[] = [];

const makeTmpDir = () => {
  const dir = fs.mkdtempSync(TMP_PREFIX);
  createdDirs.push(dir);
  return dir;
};

afterEach(() => {
  while (createdDirs.length) {
    const dir = createdDirs.pop();
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
});

const BASE_PARSE_OPTS: ParseValueOptions = {
  convertPxToRem: false,
  convertCase: false,
  includeFileName: false,
};

const toKebabCase = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const createThemeGenerator = (opts: TokensParserOptions) => {
  const resolver = new TokenResolver({
    opts,
    fileCache: {},
    defaultParseOptions: BASE_PARSE_OPTS,
    verbose: false,
    useFileStructureLookup: false,
  });

  const scssParser = new SCSSParser({
    opts,
    cssVarsPrefer: 'last',
    resolver,
    defaultParseOptions: BASE_PARSE_OPTS,
    convertNumberByKey: (v) => `${v}px`,
    tryParseColor: (value) => value,
    parseNestedValue: resolver.parseNestedValue.bind(resolver),
    resolveIncludeServiceFields: resolver.resolveIncludeServiceFields.bind(resolver),
    toKebabCase,
    isKeyValid: () => true,
    verbose: false,
  });

  return new ThemeGenerator({
    opts,
    resolver,
    parser: scssParser,
    defaultParseOptions: BASE_PARSE_OPTS,
    toKebabCase,
  });
};

describe('ThemeGenerator', () => {
  it('serialises theme objects to CSS blocks', () => {
    const generator = createThemeGenerator({
      outDir: '.tmp',
      build: '.tmp',
      source: '.tmp',
      paths: [],
      mapOptions: { prefix: 'ds', includeServiceFields: [] },
      cssVarOptions: { prefix: 'ds' },
    });

    const css = generator.generateThemesBlockFromObject(
      {
        Light: {
          surface: {
            primary: {
              value: '#ffffff',
              type: 'color',
              meta: { build: { web: { exportAsVar: true } } },
            },
          },
        },
        Dark: {
          surface: {
            primary: {
              value: '#0f172a',
              type: 'color',
              meta: { build: { web: { exportAsVar: true } } },
            },
          },
        },
      },
      true,
    );

    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('--ds-surface-primary');
  });

  it('writes CSS file when generating from JSON source', async () => {
    const dir = makeTmpDir();
    const src = path.join(dir, 'themes.json');
    const out = path.join(dir, 'themes.css');

    fs.writeFileSync(
      src,
      JSON.stringify(
        {
          light: {
            surface: {
              neutral: {
                value: '#fafafa',
                type: 'color',
                meta: { build: { web: { exportAsVar: true } } },
              },
            },
          },
          dark: {
            surface: {
              neutral: {
                value: '#0f172a',
                type: 'color',
                meta: { build: { web: { exportAsVar: true } } },
              },
            },
          },
        },
        null,
        2,
      ),
      'utf-8',
    );

    const generator = createThemeGenerator({
      outDir: '.tmp',
      build: '.tmp',
      source: '.tmp',
      paths: [],
      mapOptions: { prefix: 'ds', includeServiceFields: [] },
      cssVarOptions: { prefix: 'ds' },
    });

    await generator.generateThemesFromFile(src, out, true);

    expect(fs.existsSync(out)).toBe(true);
    const content = fs.readFileSync(out, 'utf-8');
    expect(content).toContain('[data-theme="light"]');
    expect(content).toContain('[data-theme="dark"]');
    expect(content).toContain('--ds-surface-neutral');
  });
});
