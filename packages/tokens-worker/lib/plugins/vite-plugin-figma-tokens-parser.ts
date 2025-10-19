// This file were developed with the assistance of AI tools.

import type { Plugin } from 'vite';
import path from 'node:path';
import fs from 'node:fs';

import {
  normalizeFigmaTokensParserConfig,
  type FigmaTokensParserConfig,
} from '../config/figma-options.js';
import { runFigmaTokensParser, transformFile } from '../parsers/FigmaTokensParser.js';

const toAbsoluteGlob = (rootDir: string, pattern: string): string => {
  const normalized = pattern.replace(/\\/g, '/');
  const segments = normalized.split('/');
  return path.join(rootDir, ...segments);
};

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export interface VitePluginFigmaTokensParserOptions
  extends Omit<FigmaTokensParserConfig, 'mode'> {
  mode?: FigmaTokensParserConfig['mode'];
}

export function VitePluginFigmaTokensParser(
  config: VitePluginFigmaTokensParserOptions,
): Plugin {
  const normalized = normalizeFigmaTokensParserConfig(config);
  const { parserOptions, watchGlobs, mode, watch, runOnBuildStart } = normalized;

  const sourceAbs = path.resolve(parserOptions.source);
  const outAbs = path.resolve(parserOptions.outDir);

  const applyMode = mode.apply === 'both' ? undefined : (mode.apply ?? 'build');
  const enforceMode = mode.enforce ?? 'post';

  const runParser = async () => {
    ensureDirExists(outAbs);
    await runFigmaTokensParser({ ...parserOptions, source: sourceAbs, outDir: outAbs });
  };

  return {
    name: 'vite-plugin-figma-tokens-parser',
    apply: applyMode,
    enforce: enforceMode,

    async buildStart() {
      if (runOnBuildStart) {
        await runParser();
      }
    },

    configureServer(server) {
      if (!watch) return;

      if (!fs.existsSync(sourceAbs)) {
        console.warn(`[FigmaTokensParser] Source directory not found: ${sourceAbs}`);
        return;
      }

      const absoluteGlobs = watchGlobs.map((pattern) =>
        toAbsoluteGlob(sourceAbs, pattern),
      );

      server.watcher.add(absoluteGlobs);

      const handleChange = async (file: string) => {
        if (!file.toLowerCase().endsWith('.json')) return;
        if (!file.startsWith(sourceAbs)) return;

        try {
          await transformFile(file, {
            ...parserOptions,
            source: sourceAbs,
            outDir: outAbs,
          });
          server.ws.send({ type: 'full-reload' });
          if (parserOptions.verbose) {
            console.log(
              `[FigmaTokensParser] Updated: ${path.relative(sourceAbs, file)}`,
            );
          }
        } catch (err) {
          console.warn(`[FigmaTokensParser] Failed to update ${file}:`, err);
        }
      };

      server.watcher.on('change', handleChange);
      server.watcher.on('add', handleChange);
    },
  };
}
