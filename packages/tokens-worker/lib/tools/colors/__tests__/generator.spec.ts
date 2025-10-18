import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { generateDerivativeColors, generateColorsFromFile } from '../index.js';
import type { MainColor } from '../types.ts';

describe('colors generator modules', () => {
  let tmpDir = '';

  const createTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'colors-generator-'));

  const writeJSON = (filePath: string, data: any) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  };

  beforeEach(() => {
    tmpDir = createTempDir();
  });

  afterEach(() => {
    if (tmpDir && fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('produces lightness variants with sorted increments', () => {
    const base: MainColor = {
      id: 'primary',
      name: 'primary',
      value: '#3366ff',
      step: 4,
      prefix: '',
      separator: '-',
    };

    const derivatives = generateDerivativeColors(base);

    expect(derivatives.length).toBe(5);
    expect(derivatives[0].fullName).toBe('primary-0');
    expect(derivatives[derivatives.length - 1].fullName).toBe('primary-1000');
    expect(derivatives.map((d) => d.increment)).toEqual(
      [...derivatives.map((d) => d.increment)].sort((a, b) => a - b),
    );
    expect(derivatives.every((d) => d.value.startsWith('#'))).toBe(true);
  });

  it('creates flat and token JSON outputs', () => {
    const source = path.join(tmpDir, 'colors.json');
    const outDir = path.join(tmpDir, 'output.json');

    writeJSON(source, {
      palette: {
        primary: { value: '#123456' },
      },
    });

    generateColorsFromFile({ source, outDir, step: 2 });

    const flat = JSON.parse(fs.readFileSync(outDir, 'utf-8'));
    const tokens = JSON.parse(
      fs.readFileSync(path.join(path.dirname(outDir), '_output.json'), 'utf-8'),
    );

    expect(Object.keys(flat).length).toBeGreaterThan(0);
    expect(tokens).toMatchObject({
      'palette-primary-0': { $type: 'color', $value: expect.any(String) },
    });
  });

  it('writes markdown files when requested', () => {
    const source = path.join(tmpDir, 'colors.json');
    const outDir = path.join(tmpDir, 'palette/output.json');

    writeJSON(source, {
      palette: {
        secondary: { value: '#f87171' },
      },
    });

    generateColorsFromFile({ source, outDir, writeMarkdownFiles: true });

    const mainMd = outDir.replace(/\.json$/, '.md');
    const underscoredMd = path
      .join(path.dirname(outDir), '_' + path.basename(outDir))
      .replace(/\.json$/, '.md');

    expect(fs.existsSync(mainMd)).toBe(true);
    expect(fs.existsSync(underscoredMd)).toBe(true);

    const mdContent = fs.readFileSync(mainMd, 'utf-8');
    expect(mdContent).toContain('| Token | Value |');
  });

  it('throws for non-json sources', () => {
    const source = path.join(tmpDir, 'colors.yaml');
    const outDir = path.join(tmpDir, 'output.json');
    fs.writeFileSync(
      source,
      `palette:
  primary: #fff`,
    );

    expect(() => generateColorsFromFile({ source, outDir })).toThrow('Invalid source file');
  });
});
