// Portions of this file were developed with the assistance of AI tools.

import { PluginOption } from 'vite';
import path from 'node:path';
import fs from 'node:fs';

import { generateColorsFromFile } from '../parsers/ColorsGenerator.js';

interface ColorsGeneratorPluginOptions {
  source: string;
  outDir: string;
  step?: number;
  comment?: string;
  /**
   * Vite lifecycle application mode:
   * - 'serve' — dev only
   * - 'build' — build only
   * - 'both'  — explicitly run in both
   */
  apply?: 'serve' | 'build' | 'both';

  /**
   * Vite plugin execution order:
   * - 'pre' | 'post' | undefined
   */
  enforce?: 'pre' | 'post';
}

export default function ColorsGeneratorPlugin(options: ColorsGeneratorPluginOptions): PluginOption {
  const absSource = path.resolve(options.source);
  const absOutDir = path.resolve(options.outDir);

  const applyMode = options.apply === 'both' ? undefined : (options.apply ?? 'serve');
  const enforceMode = options.enforce ?? 'pre';

  return {
    name: 'vite-plugin-colors-generator',
    apply: applyMode,
    enforce: enforceMode,

    configResolved() {
      console.log(`[colors-generator] Watching: ${absSource}`);
    },

    buildStart() {
      if (!fs.existsSync(absSource)) {
        this.error(`[colors-generator] Source file not found: ${absSource}`);
      }

      generateColorsFromFile({
        ...options,
        source: absSource,
        outDir: absOutDir,
      });
    },

    handleHotUpdate(ctx) {
      if (ctx.file === absSource) {
        console.log(`[colors-generator] Regenerating due to change in ${ctx.file}`);
        try {
          generateColorsFromFile({
            ...options,
            source: absSource,
            outDir: absOutDir,
          });
          console.log(`[colors-generator] ✅ Updated`);
        } catch (err) {
          console.error(`[colors-generator] ❌ Error:`, err);
        }
      }
    },
  };
}
