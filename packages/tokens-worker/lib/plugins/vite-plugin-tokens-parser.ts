// This file were developed with the assistance of AI tools.

import type { Plugin } from 'vite';
import chokidar from 'chokidar';

import { TokensParser } from '../parsers/TokensParser.js';
import {
  normalizeTokensParserConfig,
  type TokensParserConfig,
} from '../config/tokens-options.js';

type ModeConfig = {
  enforce?: 'pre' | 'post';
  apply?: 'build' | 'serve' | ((config: any, env: any) => boolean);
};

export interface ViteTokensPluginOptions extends TokensParserConfig {
  mode?: ModeConfig;
}

export function TokensParserPlugin(options: ViteTokensPluginOptions): Plugin {
  const { mode, ...parserConfig } = options;
  const { parserOptions, watchGlobs } = normalizeTokensParserConfig(parserConfig);

  const enforceMode = mode?.enforce ?? 'pre';
  const applyMode = mode?.apply ?? 'build';

  let parser: TokensParser;

  const runParser = async () => {
    if (parserOptions.verbose) {
      console.log('[tokens-parser] resolver paths:', parserOptions.paths);
    }

    parser = new TokensParser(parserOptions);
    await parser.buildAndParse();
  };

  return {
    name: 'vite-plugin-tokens-parser',
    enforce: enforceMode,
    apply: applyMode,

    async buildStart() {
      await runParser();
    },

    configureServer(server) {
      const watcher = chokidar.watch(watchGlobs, {
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
