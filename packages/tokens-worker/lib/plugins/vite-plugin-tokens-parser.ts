// Portions of this file were developed with the assistance of AI tools.

import type { Plugin } from 'vite';
import chokidar from 'chokidar';
import { TokensParser, type TokensParserOptions } from '../parsers/TokensParser.js';

export interface ViteTokensPluginOptions extends TokensParserOptions {
  /** Controls when plugin is applied (e.g. "build", "serve", or "both") */
  apply?: 'build' | 'serve' | ((config: any, env: any) => boolean);
  /** Controls plugin execution priority (Vite/Rollup standard) */
  enforce?: 'pre' | 'post';
}

export function TokensParserPlugin(options: ViteTokensPluginOptions): Plugin {
  let parser: TokensParser;

  return {
    name: 'vite-plugin-tokens-parser',
    enforce: options.enforce ?? 'pre',
    apply: options.apply ?? 'build',

    async buildStart() {
      parser = new TokensParser(options);
      await parser.buildAndParse();
    },

    configureServer(server) {
      const watchPaths =
        options.paths?.length && options.paths.length > 0
          ? options.paths.map((p) => `${p}/**/*.json`)
          : ['**/*.json'];

      const watcher = chokidar.watch(watchPaths, {
        ignoreInitial: true,
      });

      watcher.on('change', async (file) => {
        console.log(`[tokens-parser] 🔁 File changed: ${file}`);

        parser = new TokensParser(options);
        await parser.buildAndParse();

        const entryFile = options.entryFilePath ?? 'tokens';
        const mod = server.moduleGraph.getModuleById(entryFile);

        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({
            type: 'update',
            updates: [
              {
                type: 'js-update',
                path: entryFile,
                acceptedPath: entryFile,
                timestamp: Date.now(),
              },
            ],
          });
          console.log(`[tokens-parser] 🔁 HMR triggered for ${entryFile}`);
        } else {
          console.warn(`[tokens-parser] ⚠️ Could not find module ${entryFile} in Vite graph`);
        }
      });
    },
  };
}
