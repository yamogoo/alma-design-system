// Portions of this file were developed with the assistance of AI tools.

import type { PluginOption } from 'vite';
import path from 'node:path';
import fs from 'node:fs';

import { generateColorsFromFile } from '../tools/colors/index.js';
import type { ColorsGeneratorOptions } from '../tools/colors/types.js';

type ModeConfig = {
  enforce?: 'pre' | 'post';
  apply?: 'build' | 'serve' | 'both';
};

type PathsConfig = {
  input: string;
  output: string;
};

type GeneratorConfig = {
  levels?: number;
  comment?: string;
  // Future extensions:
  // colorspace?: string;
  // strategy?: string;
  // gamutClamp?: boolean;
  // round?: { decimals?: number };
  // keys?: { prefix?: string; separator?: string };
};

export interface ColorsGeneratorPluginOptions {
  mode?: ModeConfig;
  paths: PathsConfig;
  generator?: GeneratorConfig;
}

const toAbsolutePath = (filePath: string): string => path.resolve(filePath);

export default function ColorsGeneratorPlugin(options: ColorsGeneratorPluginOptions): PluginOption {
  if (!options.paths?.input) {
    throw new Error('[colors-generator] paths.input is required');
  }
  if (!options.paths?.output) {
    throw new Error('[colors-generator] paths.output is required');
  }

  const absInput = toAbsolutePath(options.paths.input);
  const absOutput = toAbsolutePath(options.paths.output);

  const mode = options.mode ?? {};
  const applyMode = mode.apply === 'both' ? undefined : (mode.apply ?? 'build');
  const enforceMode = mode.enforce ?? 'pre';

  const generator = options.generator ?? {};
  const levels = generator.levels ?? 40;

  const buildTask = () => {
    if (!fs.existsSync(absInput)) {
      throw new Error(`[colors-generator] Source file not found: ${absInput}`);
    }

    const generatorOptions: ColorsGeneratorOptions = {
      source: absInput,
      outDir: absOutput,
      step: levels,
      comment: generator.comment,
    };

    generateColorsFromFile(generatorOptions);
  };

  return {
    name: 'vite-plugin-colors-generator',
    apply: applyMode,
    enforce: enforceMode,

    configResolved() {
      console.log(`[colors-generator] Watching: ${absInput}`);
    },

    buildStart() {
      try {
        buildTask();
      } catch (err) {
        this.error(err instanceof Error ? err.message : String(err));
      }
    },

    handleHotUpdate(ctx) {
      if (ctx.file === absInput) {
        console.log(`[colors-generator] Regenerating due to change in ${ctx.file}`);
        try {
          buildTask();
          console.log('[colors-generator] ✅ Updated');
        } catch (err) {
          console.error('[colors-generator] ❌ Error:', err);
        }
      }
    },
  };
}
