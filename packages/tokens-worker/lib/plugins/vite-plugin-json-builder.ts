// Portions of this file were developed with the assistance of AI tools (ChatGPT).

import type { Plugin } from "vite";
import path from "node:path";
import { watch } from "chokidar";
import { JSONBuilder, JSONBuilderOptions } from "../parsers/JSONBuilder.js";

export interface ViteJSONBuilderPluginOptions extends JSONBuilderOptions {
  watch?: boolean;
}

export function JSONBuilderPlugin(
  options: ViteJSONBuilderPluginOptions
): Plugin {
  let builder: JSONBuilder;

  return {
    name: "vite-plugin-json-builder",

    async buildStart() {
      builder = new JSONBuilder(options);
      await builder.build();

      if (options.watch) {
        const watcher = watch(options.paths, {
          ignoreInitial: true,
        });

        watcher.on("add", async () => await builder.build());
        watcher.on("change", async () => await builder.build());
        watcher.on("unlink", async () => await builder.build());
      }
    },

    async handleHotUpdate({ file, server }) {
      if (options.paths.some((p) => file.startsWith(path.resolve(p)))) {
        await builder.build();
        server.ws.send({
          type: "full-reload",
        });
      }
    },
  };
}
