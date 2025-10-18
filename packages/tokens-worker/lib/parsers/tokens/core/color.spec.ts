// This file were developed with the assistance of AI tools.
//
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { ColorToolkit } from './color.js';
import { TokenResolver } from './resolver.js';
import type { ParseValueOptions, TokensParserOptions } from '../types.js';

const TMP_PREFIX = path.join(os.tmpdir(), 'color-toolkit-spec-');
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

const createToolkit = (paths: string[] = [], verbose = false) => {
  const options: TokensParserOptions = {
    outDir: '.tmp',
    build: '.tmp',
    source: '.tmp',
    paths,
    mapOptions: { prefix: '', includeServiceFields: [] },
    cssVarOptions: { prefix: '' },
  };

  const resolver = new TokenResolver({
    opts: options,
    fileCache: {},
    defaultParseOptions: BASE_PARSE_OPTS,
    verbose,
    useFileStructureLookup: true,
  });

  return new ColorToolkit({
    resolver,
    defaultParseOptions: BASE_PARSE_OPTS,
    verbose,
  });
};

describe('ColorToolkit', () => {
  let dir: string;

  beforeEach(() => {
    dir = makeTmpDir();
  });

  it('parses raw colors, references, and expressions', () => {
    fs.writeFileSync(
      path.join(dir, 'palette.json'),
      JSON.stringify({ primary: { value: '#3366ff' } }, null, 2),
      'utf-8',
    );

    const toolkit = createToolkit([dir]);

    expect(toolkit.tryParseColor('#000000')).toBe('#000000');
    expect(toolkit.tryParseColor('{palette.primary.value}')).toBe('#3366ff');
    expect(toolkit.tryParseColor('mix(#ffffff, #000000, 0.25)')).toBe('#aeaeae');
    expect(toolkit.tryParseColor('rgba({palette.primary.value}, 0.5)')).toBe('#3366ff80');
    expect(toolkit.tryParseColor('lighten({palette.primary.value}, 0.1)')).toMatch(/^#/);
    expect(toolkit.tryParseColor('oklch(0.5 0.1 35)')).toMatch(/^#/);
    expect(toolkit.tryParseColor('lightness(shift_oklch(#001149, 0.03), 0.25)')).toMatch(/^#/);
  });

  it('returns null for unknown colors', () => {
    const toolkit = createToolkit();
    expect(toolkit.tryParseColor('invalid-color')).toBeNull();
  });

  it('mixes OKLCH colors and adjusts contrast when picking readable colors', () => {
    const toolkit = createToolkit();

    const blended = toolkit.mixOKLCH('#ffffff', '#000000', 0.5);
    expect(blended).toMatch(/^#/);

    const readable = toolkit.pickReadable('#222222', '#f8fafc', '#0f172a', 4.5);
    expect(readable).toBeTypeOf('string');
  });
});
