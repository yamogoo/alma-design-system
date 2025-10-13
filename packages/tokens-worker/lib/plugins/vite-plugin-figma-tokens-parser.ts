// Portions of this file were developed with the assistance of AI tools.

import type { Plugin } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import {
  runFigmaTokensParser,
  transformFile,
  type FigmaTokensParserOptions,
} from '../parsers/FigmaTokensParser.js';

export interface ViteFigmaTokensParserOptions extends FigmaTokensParserOptions {
  /** Run once at build start (default: true) */
  runOnBuildStart?: boolean;
  /** Re-run on file change in dev (default: true) */
  watch?: boolean;
  /** Controls plugin execution priority (Vite/Rollup standard) */
  enforce?: 'pre' | 'post';
  /** Controls when plugin is applied (build/serve/both or function) */
  apply?: 'build' | 'serve' | ((config: any, env: any) => boolean);
}

function listJsonFilesSync(rootDir: string, opts: ViteFigmaTokensParserOptions): string[] {
  const out: string[] = [];
  const stack = [rootDir];
  const shouldSkip = (name: string) => {
    if ((opts.ignoreDotfiles ?? true) && name.startsWith('.')) return true;
    if ((opts.ignoreUnderscored ?? true) && name.startsWith('_')) return true;
    return false;
  };
  while (stack.length) {
    const dir = stack.pop()!;
    if (!fs.existsSync(dir)) continue; // 🔹 safe check
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (shouldSkip(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.json')) out.push(full);
    }
  }
  return out;
}

export function VitePluginFigmaTokensParser(options: ViteFigmaTokensParserOptions): Plugin {
  const opts: ViteFigmaTokensParserOptions = {
    runOnBuildStart: true,
    watch: true,
    ignoreDotfiles: true,
    ignoreUnderscored: true,
    ...options,
  };

  const sourceAbs = path.resolve(opts.source);
  const outAbs = path.resolve(opts.outDir);

  return {
    name: 'vite-plugin-figma-tokens-parser',
    enforce: opts.enforce ?? 'post',
    apply: opts.apply ?? 'build',

    async buildStart() {
      if (opts.runOnBuildStart) {
        console.log(`[FigmaTokensParser] Parsing "${sourceAbs}" -> "${outAbs}" ...`);
        await runFigmaTokensParser({ ...opts, source: sourceAbs, outDir: outAbs });
      }
    },

    configureServer(server) {
      if (!opts.watch) return;

      if (!fs.existsSync(sourceAbs)) {
        console.warn(`[FigmaTokensParser] Source directory not found: ${sourceAbs}`);
        return;
      }

      const initialFiles = listJsonFilesSync(sourceAbs, opts);
      server.watcher.add(initialFiles);

      const onChange = async (file: string) => {
        if (!file.toLowerCase().endsWith('.json')) return;
        if (!file.startsWith(sourceAbs)) return;

        try {
          await transformFile(file, { ...opts, source: sourceAbs, outDir: outAbs });
          server.ws.send({ type: 'full-reload' });
          console.log(`[FigmaTokensParser] Updated: ${path.relative(sourceAbs, file)}`);
        } catch (e) {
          console.warn(`[FigmaTokensParser] Failed to update ${file}: ${e}`);
        }
      };

      server.watcher.on('add', onChange);
      server.watcher.on('change', onChange);
    },
  };
}
