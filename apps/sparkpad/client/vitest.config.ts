import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig({ mode: "development" }),
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      reporters: ["html", "verbose"],
      outputFile: "./tests-report/index.html",
      globals: true,
      setupFiles: "./vitest.setup.ts",
      server: {
        deps: {
          inline: ["vitest-canvas-mock"],
        },
      },
      environmentOptions: {
        jsdom: {
          resources: "usable",
        },
      },
      css: {
        modules: {
          classNameStrategy: "non-scoped",
        },
      },
    },
  })
);
