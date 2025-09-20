// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import { Plugin } from "vite";
import chokidar from "chokidar";

import {
  FlattenTokensParser,
  FlattenTokensParserOptions,
} from "../parsers/FlattenTokensParser.js";

export function FlattenTokensParserPlugin(
  options: FlattenTokensParserOptions
): Plugin {
  let parser: FlattenTokensParser;

  return {
    name: "vite-plugin-flatten-tokens-parser",
    enforce: "pre",

    async buildStart() {
      parser = new FlattenTokensParser(options);
      await parser.buildAndParse();
    },

    configureServer(server) {
      const watchPath = `${options.source}/**/*.json`;
      const watcher = chokidar.watch(watchPath, { ignoreInitial: true });

      watcher.on("change", async (file) => {
        console.log(`[flatten-tokens-parser] 🔁 File changed: ${file}`);
        parser = new FlattenTokensParser(options);
        await parser.buildAndParse();

        const virtualModule = "tokens";
        const mod = server.moduleGraph.getModuleById(virtualModule);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({
            type: "update",
            updates: [
              {
                type: "js-update",
                path: virtualModule,
                acceptedPath: virtualModule,
                timestamp: Date.now(),
              },
            ],
          });
          console.log(
            `[flatten-tokens-parser] 🔁 HMR triggered for ${virtualModule}`
          );
        }
      });
    },
  };
}
