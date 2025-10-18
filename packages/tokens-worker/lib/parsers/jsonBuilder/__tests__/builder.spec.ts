import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { afterEach, describe, expect, it } from 'vitest';

import { JSONBuilder } from '../builder.js';

describe('JSONBuilder class', () => {
  let tmpDir: string;

  const createTempDir = () => fs.mkdtemp(path.join(os.tmpdir(), 'json-builder-'));

  const writeJSON = async (filePath: string, data: any) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  };

  afterEach(async () => {
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('builds separate files per token', async () => {
    tmpDir = await createTempDir();
    const sourceDir = path.join(tmpDir, 'src');
    await writeJSON(path.join(sourceDir, 'button.json'), { size: { value: 'md' } });

    const builder = new JSONBuilder({
      paths: [sourceDir],
      outDir: path.join(tmpDir, 'out'),
      useTokensInSeparateFiles: true,
    });

    await builder.build();

    const outFile = path.join(tmpDir, 'out', 'button.json');
    const content = JSON.parse(await fs.readFile(outFile, 'utf-8'));
    expect(content).toHaveProperty('size.value', 'md');
  });

  it('merges into single file when disabled per-token output', async () => {
    tmpDir = await createTempDir();
    const sourceDir = path.join(tmpDir, 'src');
    await writeJSON(path.join(sourceDir, 'global.json'), { colors: { primary: '#ff0000' } });

    const builder = new JSONBuilder({
      paths: [sourceDir],
      outDir: path.join(tmpDir, 'out'),
      useTokensInSeparateFiles: false,
      includeRootDirName: true,
    });

    await builder.build();

    const outFile = path.join(tmpDir, 'out', 'tokens.json');
    const content = JSON.parse(await fs.readFile(outFile, 'utf-8'));
    expect(content).toHaveProperty('src.global.colors.primary', '#ff0000');
  });

  it('builds entry file when entryFilePath provided', async () => {
    tmpDir = await createTempDir();
    const sourceDir = path.join(tmpDir, 'src');
    await writeJSON(path.join(sourceDir, 'card.json'), { padding: { value: 8 } });

    const outDir = path.join(tmpDir, 'out');
    const entryFilePath = path.join(tmpDir, 'index.ts');

    const builder = new JSONBuilder({
      paths: [sourceDir],
      outDir,
      entryFilePath,
    });

    await builder.build();

    const entry = await fs.readFile(entryFilePath, 'utf-8');
    expect(entry).toContain('import card from');
    expect(entry).toContain('export default module');
  });
});
