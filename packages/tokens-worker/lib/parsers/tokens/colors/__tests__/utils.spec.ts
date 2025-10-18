import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { afterEach, describe, expect, it } from 'vitest';

import {
  toKebab,
  hasField,
  getField,
  isColorish,
  ensureDirForFile,
  resolveOutputPaths,
} from '../utils.ts';

describe('colors utils', () => {
  let tmpDir: string;

  const createTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'colors-utils-'));

  afterEach(() => {
    if (tmpDir && fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('converts different cases to kebab case', () => {
    expect(toKebab('PrimaryColor')).toBe('primary-color');
    expect(toKebab('primaryColorVariant')).toBe('primary-color-variant');
    expect(toKebab('Primary Color Variant')).toBe('primary-color-variant');
  });

  it('detects token value fields', () => {
    const obj = { $value: '#fff' };
    expect(hasField(obj, 'value')).toBe(true);
    expect(getField(obj, 'value')).toBe('#fff');
    expect(hasField({}, 'value')).toBe(false);
  });

  it('identifies colorish strings', () => {
    expect(isColorish('#ffffff')).toBe(true);
    expect(isColorish('rgb(0, 0, 0)')).toBe(true);
    expect(isColorish('not-a-color')).toBe(false);
    expect(isColorish(123)).toBe(false);
  });

  it('ensures directory exists for file', () => {
    tmpDir = createTempDir();
    const filePath = path.join(tmpDir, 'nested/output.json');
    ensureDirForFile(filePath);
    expect(fs.existsSync(path.dirname(filePath))).toBe(true);
  });

  it('resolves output paths correctly', () => {
    const out = '/path/to/colors/output.json';
    const { mainPath, underscoredPath, mainMd, underscoredMd, baseName } = resolveOutputPaths(out);

    expect(mainPath).toBe('/path/to/colors/output.json');
    expect(underscoredPath).toBe('/path/to/colors/_output.json');
    expect(mainMd).toBe('/path/to/colors/output.md');
    expect(underscoredMd).toBe('/path/to/colors/_output.md');
    expect(baseName).toBe('output');
  });
});
