import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { normalizeFigmaTokensParserConfig } from '../../config/figma-options.js';
import { runFigmaTokensParser } from '../FigmaTokensParser.js';

const createTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'figma-parser-'));

const writeJSON = (filePath: string, data: any) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

describe('Figma tokens parser config', () => {
  it('normalizes defaults', () => {
    const normalized = normalizeFigmaTokensParserConfig({
      paths: {
        input: './input',
        output: './output',
      },
    });

    expect(normalized.parserOptions.includeGlobs).toEqual(['**/*.json']);
    expect(normalized.mode.enforce).toBe('post');
    expect(normalized.runOnBuildStart).toBe(true);
  });
});

describe('Figma tokens parser execution', () => {
  let tempDir = '';

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('transforms json tokens into output directory', async () => {
    const sourceDir = path.join(tempDir, 'tokens');
    const outDir = path.join(tempDir, 'figma');

    writeJSON(path.join(sourceDir, 'colors.json'), {
      palette: {
        primary: {
          value: '#123456',
          $description: 'demo',
        },
        secondary: {
          value: '{palette.primary}',
        },
      },
    });

    await runFigmaTokensParser({
      paths: {
        input: sourceDir,
        output: outDir,
      },
    });

    const outputFile = path.join(outDir, 'colors.json');
    expect(fs.existsSync(outputFile)).toBe(true);

    const exported = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    expect(exported.palette.primary.value).toBe('#123456');
    expect(exported.palette.primary.$description).toBeUndefined();
    expect(exported.palette.secondary.value).toBe('#123456');
  });
});
