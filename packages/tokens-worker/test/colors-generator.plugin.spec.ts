import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/tools/colors/index.js', async () =>
  import('../lib/parsers/tokens/colors/generator.ts')
);

const loadPlugin = async () => (await import('../lib/plugins/vite-plugin-colors-generator.ts')).default;

const createTempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'colors-plugin-'));

const writeJSON = (filePath: string, data: any) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

describe('ColorsGeneratorPlugin', () => {
  let tmpDir: string;
  const originalLog = console.log;
  const originalError = console.error;

  beforeEach(() => {
    tmpDir = createTempDir();
    console.log = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log = originalLog;
    console.error = originalError;
  });

  const runBuildStart = async (options: { source: string; outDir: string; step?: number; writeMarkdownFiles?: boolean; apply?: 'serve' | 'build' | 'both'; enforce?: 'pre' | 'post'; }) => {
    const ColorsGeneratorPlugin = await loadPlugin();
    const plugin = ColorsGeneratorPlugin(options);
    const hookContext = {
      error: (message: string) => {
        throw new Error(message);
      },
    } as any;

    const buildStartHook = (plugin as any).buildStart?.bind(hookContext);
    if (buildStartHook) await buildStartHook();
  };

  it('generates color derivatives during buildStart', async () => {
    const source = path.join(tmpDir, 'colors.json');
    const outDir = path.join(tmpDir, 'output.json');

    writeJSON(source, {
      palette: {
        primary: { value: '#3366ff' },
      },
    });

    await runBuildStart({ source, outDir, step: 4 });

    const flat = JSON.parse(fs.readFileSync(outDir, 'utf-8'));
    const tokens = JSON.parse(fs.readFileSync(path.join(path.dirname(outDir), '_output.json'), 'utf-8'));

    expect(flat).toBeTypeOf('object');
    expect(tokens).toBeTypeOf('object');
    expect(Object.keys(flat).length).toBeGreaterThan(0);
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
  });

  it('supports Markdown output when writeMarkdownFiles is true', async () => {
    const source = path.join(tmpDir, 'colors.json');
    const outDir = path.join(tmpDir, 'palette/output.json');

    writeJSON(source, {
      palette: {
        secondary: { value: '#f87171' },
      },
    });

    await runBuildStart({ source, outDir, writeMarkdownFiles: true });

    const mainMd = outDir.replace(/\.json$/, '.md');
    const underscoredMd = path.join(path.dirname(outDir), '_' + path.basename(outDir)).replace(/\.json$/, '.md');

    expect(fs.existsSync(mainMd)).toBe(true);
    expect(fs.existsSync(underscoredMd)).toBe(true);

    const mdContent = fs.readFileSync(mainMd, 'utf-8');
    expect(mdContent).toContain('| Token |');
    expect(mdContent).toContain('#');
  });

  it('throws if source file does not exist', async () => {
    const source = path.join(tmpDir, 'missing.json');
    const outDir = path.join(tmpDir, 'output.json');

    const ColorsGeneratorPlugin = await loadPlugin();
    const plugin = ColorsGeneratorPlugin({ source, outDir });

    const hookContext = {
      error(message: string) {
        throw new Error(message);
      },
    } as any;

    await expect(async () => {
      await (plugin as any).buildStart?.bind(hookContext)();
    }).rejects.toThrow('Source file not found');
  });
});
