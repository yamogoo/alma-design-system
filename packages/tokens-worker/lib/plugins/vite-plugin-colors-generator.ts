// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import { Plugin } from "vite";
import path from "node:path";
import fs from "node:fs";

import { generateColorsFromFile } from "../parsers/ColorsGenerator.js";

interface ColorsGeneratorPluginOptions {
  source: string;
  outDir: string;
  step?: number;
  comment?: string;
}

export default function ColorsGeneratorPlugin(
  options: ColorsGeneratorPluginOptions
): Plugin {
  const absSource = path.resolve(options.source);
  const absOutDir = path.resolve(options.outDir);

  return {
    name: "vite-plugin-colors-generator",
    apply: "serve",
    enforce: "pre",

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
        console.log(
          `[colors-generator] Regenerating due to change in ${ctx.file}`
        );
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
