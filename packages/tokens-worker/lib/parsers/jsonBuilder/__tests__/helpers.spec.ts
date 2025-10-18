import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { afterEach, describe, expect, it } from 'vitest';

import {
  isDirectory,
  readFileContent,
  shouldSkipEntry,
  buildTree,
  deepMerge,
  writeFormattedFile,
  buildEntryFile,
} from '../helpers.js';

const createTempDir = () => fs.mkdtemp(path.join(os.tmpdir(), 'json-builder-utils-'));

describe('jsonBuilder helpers', () => {
  let tmpDir: string;

  afterEach(async () => {
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('detects directories', async () => {
    tmpDir = await createTempDir();
    expect(await isDirectory(tmpDir)).toBe(true);
    const filePath = path.join(tmpDir, 'file.txt');
    await fs.writeFile(filePath, 'hello', 'utf-8');
    expect(await isDirectory(filePath)).toBe(false);
  });

  it('reads json and yaml content', async () => {
    tmpDir = await createTempDir();
    const jsonFile = path.join(tmpDir, 'data.json');
    const yamlFile = path.join(tmpDir, 'data.yaml');
    await fs.writeFile(jsonFile, JSON.stringify({ foo: 'bar' }, null, 2));
    await fs.writeFile(yamlFile, 'foo: baz');

    await expect(readFileContent(jsonFile)).resolves.toEqual({ foo: 'bar' });
    await expect(readFileContent(yamlFile)).resolves.toEqual({ foo: 'baz' });
  });

  it('skips hidden and underscored entries', () => {
    expect(shouldSkipEntry('.git')).toBe(true);
    expect(shouldSkipEntry('_partial')).toBe(true);
    expect(shouldSkipEntry('normal')).toBe(false);
  });

  it('builds tree recursively', async () => {
    tmpDir = await createTempDir();
    const nestedDir = path.join(tmpDir, 'nested');
    await fs.mkdir(nestedDir, { recursive: true });
    await fs.writeFile(path.join(nestedDir, 'index.json'), JSON.stringify({ inner: 1 }));
    await fs.writeFile(path.join(tmpDir, 'file.json'), JSON.stringify({ root: true }));

    const tree = await buildTree(tmpDir, {
      readFileContent,
      shouldSkipEntry,
    });

    expect(tree).toHaveProperty('file.root', true);
    expect(tree).toHaveProperty('nested.inner', 1);
  });

  it('deep merges objects and overwrites primitives', () => {
    const target = { a: { b: 1 }, arr: [1] } as any;
    const source = { a: { c: 2 }, arr: [2], val: 'x' };
    const merged = deepMerge(target, source);

    expect(merged).toEqual({ a: { b: 1, c: 2 }, arr: [2], val: 'x' });
  });

  it('writes formatted files in different formats', async () => {
    tmpDir = await createTempDir();
    const jsonPath = path.join(tmpDir, 'out.json');
    const yamlPath = path.join(tmpDir, 'out.yaml');
    const tsPath = path.join(tmpDir, 'out.ts');

    await writeFormattedFile(jsonPath, { foo: 'bar' }, 'json');
    await writeFormattedFile(yamlPath, { foo: 'bar' }, 'yaml');
    await writeFormattedFile(tsPath, { foo: 'bar' }, 'ts');

    const jsonContent = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const yamlContent = await readFileContent(yamlPath);
    const tsContent = await fs.readFile(tsPath, 'utf-8');

    expect(jsonContent).toEqual({ foo: 'bar' });
    expect(yamlContent).toEqual({ foo: 'bar' });
    expect(tsContent).toContain('export default');
  });

  it('builds entry file aggregating JSON modules', async () => {
    tmpDir = await createTempDir();
    const outDir = path.join(tmpDir, 'out');
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'a.json'), JSON.stringify({ a: 1 }));
    await fs.writeFile(path.join(outDir, 'b.json'), JSON.stringify({ b: 2 }));

    const entryPath = path.join(tmpDir, 'index.ts');
    await buildEntryFile(outDir, entryPath, shouldSkipEntry);

    const entryContents = await fs.readFile(entryPath, 'utf-8');
    expect(entryContents).toContain('import a from');
    expect(entryContents).toContain('export default module');
  });
});
