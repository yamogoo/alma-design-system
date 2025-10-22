import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TokenResolver } from '../lib/parsers/tokens/core/resolver.ts';

const writeJSON = (filePath: string, data: unknown) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

describe('TokenResolver math expressions', () => {
  let tmpDir: string;
  let resolver: TokenResolver;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tokens-math-'));

    writeJSON(path.join(tmpDir, 'tokens.json'), {
      roundness: {
        xxl: { $value: 32 },
      },
      spacing: {
        xxs: { $value: 4 },
      },
      scale: {
        ratio: { $value: 0.5 },
      },
    });

    resolver = new TokenResolver({
      opts: { paths: [tmpDir] } as any,
      fileCache: {},
      defaultParseOptions: {} as any,
      verbose: false,
    });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('evaluates subtraction between resolved tokens', () => {
    const result = resolver.parseNestedValue(
      '{tokens.roundness.xxl} - {tokens.spacing.xxs}',
      { fileName: 'test.json' } as any,
    );

    expect(result).toBe(28);
  });

  it('evaluates complex arithmetic expressions with precedence', () => {
    const result = resolver.parseNestedValue(
      '({tokens.roundness.xxl} * {tokens.scale.ratio}) + {tokens.spacing.xxs}',
      { fileName: 'test.json' } as any,
    );

    expect(result).toBe(20);
  });
});
