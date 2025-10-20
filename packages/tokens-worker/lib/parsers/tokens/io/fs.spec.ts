// This file were developed with the assistance of AI tools.
//
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { describe, it, expect, afterEach } from 'vitest';

import { TokenFileManager } from './fs.js';
import { TokenResolver } from '../core/resolver.js';
import { ColorToolkit } from '../core/color.js';
import { SCSSParser } from '../emit/scss.js';
import type { ParseValueOptions, TokensParserOptions } from '../types.js';

const TMP_PREFIX = path.join(os.tmpdir(), 'token-file-manager-spec-');
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

const BASE_PARSE_OPTIONS: ParseValueOptions = {
  convertPxToRem: false,
  convertCase: false,
  includeFileName: false,
};

const toKebabCase = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const convertNumberByKey = (value: number, key?: string, opts?: ParseValueOptions) => {
  if (opts?.unit === '') return `${value}`;
  if (typeof opts?.unit === 'string') return `${value}${opts.unit}`;
  return `${value}px`;
};

const createFileManager = (opts: TokensParserOptions) => {
  const resolver = new TokenResolver({
    opts,
    fileCache: {},
    defaultParseOptions: BASE_PARSE_OPTIONS,
    verbose: true,
    useFileStructureLookup: true,
  });

  const scssParser = new SCSSParser({
    opts,
    cssVarsPrefer: opts.cssVarsPrefer ?? 'last',
    resolver,
    defaultParseOptions: BASE_PARSE_OPTIONS,
    convertNumberByKey,
    tryParseColor: (value: string, unit?: string) => {
      const toolkit = new ColorToolkit({
        resolver,
        defaultParseOptions: BASE_PARSE_OPTIONS,
        verbose: false,
      });
      return toolkit.tryParseColor(value, unit);
    },
    parseNestedValue: resolver.parseNestedValue.bind(resolver),
    resolveIncludeServiceFields: resolver.resolveIncludeServiceFields.bind(resolver),
    toKebabCase,
    isKeyValid: () => true,
    verbose: false,
  });

  const colors = new ColorToolkit({
    resolver,
    defaultParseOptions: BASE_PARSE_OPTIONS,
    verbose: false,
  });

  return new TokenFileManager({
    opts,
    defaultParseOptions: BASE_PARSE_OPTIONS,
    defaultMapOptions: {
      ...BASE_PARSE_OPTIONS,
      convertCase: true,
      includeFileName: true,
    },
    resolver,
    scssParser,
    colors,
    fileCache: {},
    toKebabCase,
    verbose: false,
  });
};

const writeJSON = (filePath: string, data: any) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

describe('TokenFileManager', () => {
  it('resolves files, writes build outputs, and emits SCSS/CSS assets', async () => {
    const tempDir = makeTmpDir();
    const sourceDir = path.join(tempDir, 'tokens');
    const cacheDir = path.join(tempDir, '.cache');
    const buildDir = path.join(tempDir, 'build');
    const scssDir = path.join(tempDir, 'scss');
    const cssDir = path.join(tempDir, 'css');

    writeJSON(path.join(sourceDir, 'core.json'), {
      spacing: { sm: { value: 8, type: 'dimension', unit: 'px' } },
      color: {
        primary: {
          value: '#0ea5e9',
          type: 'color',
          meta: { build: { web: { exportAsVar: true } } },
        },
      },
    });

    writeJSON(path.join(sourceDir, 'aliases.json'), {
      spacing: {
        md: {
          value: '{core.spacing.sm.value}',
          type: 'dimension',
          unit: 'px',
          meta: { build: { web: { exportAsVar: true } } },
        },
      },
    });

    const opts: TokensParserOptions = {
      outDir: scssDir,
      cacheDir,
      build: buildDir,
      source: sourceDir,
      cssVarsOutDir: cssDir,
      entryFilePath: path.join(tempDir, 'entry.ts'),
      paths: [sourceDir],
      mapOptions: {
        prefix: 'ds',
        convertCase: true,
        includeFileName: true,
        includeServiceFields: ['value', 'meta'],
      },
      cssVarOptions: {
        prefix: 'ds',
        convertToCSSVariables: true,
        includeFileNameToCSSVariables: true,
        useSeparateFile: true,
        fileNamePrefix: '_runtime.',
      },
    };

    const fileManager = createFileManager(opts);
    await fileManager.buildArtifacts({
      sourceDir,
      cacheDir,
      buildDir,
      scssDir,
    });
    await fileManager.generateEntryFile();

    const cached = JSON.parse(fs.readFileSync(path.join(cacheDir, 'aliases.json'), 'utf-8'));
    expect(cached.spacing.md.value).toBe(8);

    const built = JSON.parse(fs.readFileSync(path.join(buildDir, 'aliases.json'), 'utf-8'));
    expect(built.spacing.md.value).toBe(8);

    const scssContent = fs.readFileSync(path.join(scssDir, '_aliases.scss'), 'utf-8');
    expect(scssContent).toContain('value: 8px');
    expect(scssContent).toContain('aliases');

    const cssContent = fs.readFileSync(path.join(cssDir, '_runtime.aliases.css'), 'utf-8');
    expect(cssContent).toContain('--ds-aliases-spacing-md: 8px;');

    const entryContent = fs.readFileSync(path.join(tempDir, 'entry.ts'), 'utf-8');
    expect(entryContent).toContain('import aliases');
  });

  it('writes unresolved token log when references cannot be resolved', async () => {
    const tempDir = makeTmpDir();
    const sourceDir = path.join(tempDir, 'tokens');
    const cacheDir = path.join(tempDir, '.cache');
    const buildDir = path.join(tempDir, 'build');

    writeJSON(path.join(sourceDir, 'broken.json'), {
      color: {
        accent: {
          value: '{missing.color.value}',
        },
      },
    });

    const opts: TokensParserOptions = {
      outDir: path.join(tempDir, 'scss'),
      cacheDir,
      build: buildDir,
      source: sourceDir,
      paths: [sourceDir],
      mapOptions: { prefix: '', includeServiceFields: [] },
      cssVarOptions: { prefix: '' },
    };

    const manager = createFileManager(opts);
    await manager.buildArtifacts({
      sourceDir,
      cacheDir,
      buildDir,
      scssDir: path.join(tempDir, 'scss'),
    });

    const logPath = path.join(cacheDir, 'unresolved-tokens.log');
    expect(fs.existsSync(logPath)).toBe(true);
    const logContent = fs.readFileSync(logPath, 'utf-8').trim();
    expect(logContent).toContain('{missing.color.value}');
  });
});
