// This file were developed with the assistance of AI tools.

import type { Plugin } from 'vite';
import chokidar from 'chokidar';
import { TokensParser } from '../parsers/TokensParser.js';
import { type TokensParserOptions } from '../parsers/tokens/types.js';

export interface ViteTokensPluginOptions extends TokensParserOptions {
  /** Controls when plugin is applied (e.g. "build", "serve", or "both") */
  apply?: 'build' | 'serve' | ((config: any, env: any) => boolean);
  /** Controls plugin execution priority (Vite/Rollup standard) */
  enforce?: 'pre' | 'post';
}

export function TokensParserPlugin(options: ViteTokensPluginOptions): Plugin {
  const { enforce, apply, ...rawParserOptions } = options;
  const parserOptions = rawParserOptions as TokensParserOptions;

  let parser: TokensParser;

  const runParser = async () => {
    parser = new TokensParser(parserOptions);
    await parser.buildAndParse();
  };

  return {
    name: 'vite-plugin-tokens-parser',
    enforce: enforce ?? 'pre',
    apply: apply ?? 'build',

    async buildStart() {
      await runParser();
    },

    configureServer(server) {
      const watchPaths =
        parserOptions.paths?.length && parserOptions.paths.length > 0
          ? parserOptions.paths.map((p) => `${p}/**/*.json`)
          : ['**/*.json'];

      const watcher = chokidar.watch(watchPaths, {
        ignoreInitial: true,
      });

      const entryFile = parserOptions.entryFilePath ?? 'tokens';

      watcher.on('change', async (file) => {
        console.log(`[tokens-parser] 🔁 File changed: ${file}`);

        await runParser();

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

      server.httpServer?.once('close', () => {
        watcher.close().catch(() => {
          /* swallow */
        });
      });
    },
  };
}
