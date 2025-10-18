// This file were developed with the assistance of AI tools.
//
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { describe, it, expect, afterEach } from 'vitest';

import { TokenResolver } from './resolver.js';
import type { ParseValueOptions, TokensParserOptions } from '../types.js';

const TMP_PREFIX = path.join(os.tmpdir(), 'token-resolver-spec-');
const createdDirs: string[] = [];

const makeTmpDir = (): string => {
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

const BASE_OPTIONS: TokensParserOptions = {
  outDir: '.tmp',
  build: '.tmp',
  source: '.tmp',
  paths: [],
  mapOptions: { prefix: '', includeServiceFields: [] },
  cssVarOptions: { prefix: '' },
};

describe('TokenResolver', () => {
  it('resolves references through cache and returns literal when unresolved', () => {
    const resolver = new TokenResolver({
      opts: BASE_OPTIONS,
      fileCache: {
        tokens: {
          spacing: { md: { value: '24px' } },
        },
      },
      defaultParseOptions: BASE_PARSE_OPTS,
      verbose: true,
      useFileStructureLookup: false,
    });

    expect(resolver.parseNestedValue('{tokens.spacing.md.value}', BASE_PARSE_OPTS)).toBe('24px');
    expect(resolver.parseNestedValue('{tokens.spacing.lg.value}', BASE_PARSE_OPTS)).toBe(
      '{tokens.spacing.lg.value}',
    );
  });

  it('performs folder-structure lookup when enabled', () => {
    const dir = makeTmpDir();
    const nested = path.join(dir, 'themes', 'light', 'surface');
    fs.mkdirSync(nested, { recursive: true });
    fs.writeFileSync(
      path.join(nested, 'background.json'),
      JSON.stringify({ neutral: { value: '#ffcc00' } }, null, 2),
      'utf-8',
    );

    const resolver = new TokenResolver({
      opts: { ...BASE_OPTIONS, paths: [dir] },
      fileCache: {},
      defaultParseOptions: BASE_PARSE_OPTS,
      verbose: true,
      useFileStructureLookup: true,
    });

    const value = resolver.parseNestedValue(
      '{themes.light.surface.background.neutral.value}',
      BASE_PARSE_OPTS,
    );
    expect(value).toBe('#ffcc00');
  });

  it('normalises include service fields based on local and global configuration', () => {
    const resolver = new TokenResolver({
      opts: {
        ...BASE_OPTIONS,
        mapOptions: { prefix: '', includeServiceFields: ['value', 'meta'] },
      },
      fileCache: {},
      defaultParseOptions: BASE_PARSE_OPTS,
      verbose: false,
      useFileStructureLookup: false,
    });

    const localAll = resolver.resolveIncludeServiceFields({
      ...BASE_PARSE_OPTS,
      includeServiceFields: true,
    });
    expect(localAll.includeAll).toBe(true);

    const fallback = resolver.resolveIncludeServiceFields(BASE_PARSE_OPTS);
    expect(fallback.includeAll).toBe(false);
    expect(fallback.set.size).toBe(0);
  });

  it('coerces token objects to scalars for nested resolution', () => {
    const resolver = new TokenResolver({
      opts: BASE_OPTIONS,
      fileCache: {},
      defaultParseOptions: BASE_PARSE_OPTS,
      verbose: false,
      useFileStructureLookup: false,
    });

    expect(resolver.coerceTokenObjectToScalar({ value: 12 })).toBe(12);
    expect(resolver.coerceTokenObjectToScalar({ $value: 'foo' })).toBe('foo');
    expect(resolver.coerceTokenObjectToScalar('plain')).toBe('plain');
  });
});
