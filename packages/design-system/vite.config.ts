import { defineConfig, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import { visualizer } from "rollup-plugin-visualizer";
import vueJsx from "@vitejs/plugin-vue-jsx";

import path from "path";
import { fileURLToPath, URL } from "node:url";

import svgLoader from "vite-svg-loader";
import lightningcss from "vite-plugin-lightningcss";
import dts from "vite-plugin-dts";

import config from "./src/tokens/src/config.json";

const PREFIX = config.namespace?.$value || "al-";

import {
  ColorsGeneratorPlugin,
  TokensParserPlugin,
  VitePluginTokensLinter,
  VitePluginFigmaTokensParser,
} from "@alma/tokens-worker";

const ANALYZE = process.env.ANALYZE === "1";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default () => {
  return defineConfig({
    cacheDir: "../../.vite",
    plugins: [
      vue(),
      ANALYZE &&
        (visualizer({
          emitFile: true,
          filename: "stats.html",
          template: "raw-data",
          gzipSize: true,
        }) as PluginOption),
      ANALYZE &&
        (visualizer({
          emitFile: true,
          filename: "stats-list.yml",
          template: "list",
        }) as PluginOption),
      ANALYZE &&
        (visualizer({
          emitFile: true,
          filename: "stats-flamegraph.html",
          template: "flamegraph",
        }) as PluginOption),
      vueJsx({
        transformOn: true,
        mergeProps: true,
      }),
      svgLoader({ defaultImport: "component" }),
      // Deign System: Tokens and SCSS generation
      ColorsGeneratorPlugin({
        mode: {
          enforce: "pre",
          apply: "build",
        },
        paths: {
          input: "./src/tokens/src/baseColors.json",
          output: "./src/tokens/src/colors.json",
        },
        generator: {
          levels: 40,
        },
      }),
      TokensParserPlugin({
        mode: {
          enforce: "pre",
          apply: "build",
        },
        paths: {
          src: "./src/tokens/src",
          cache: "./src/tokens/.cache",
          out: "./src/tokens/output",
          entry: "./src/tokens/index.ts",
          scssOut: "./src/assets/scss/abstracts",
        },
        include: [
          "./src/tokens/src/**/*.json",
          "./src/tokens/.cache/**/*.json",
        ],
        naming: {
          prefix: "",
          caseTransform: true,
          includeFileName: true,
        },
        fields: {
          include: ["value", "respond"],
        },
        targets: {
          scssMap: {
            useDefaultFlag: true,
          },
          cssVars: {
            enabled: false,
            prefix: PREFIX,
            includeFileName: false,
            exclude: ["./src/tokens/.cache/themes.json"],
            separateFile: true,
            fileNamePrefix: "_runtime.",
          },
          themes: {
            enabled: true,
            input: "./src/tokens/output/themes.json",
            output: "./src/assets/scss/abstracts/_runtime_themes.scss",
            requireAll: true,
          },
        },
        builder: {
          format: "json",
          roots: ["./src/tokens/src"],
          includeRootDir: false,
        },
        resolver: {
          fileLookup: false,
          mergeIntoEntry: true,
        },
      }),
      VitePluginTokensLinter({
        source: "./src/tokens/src",
      }),
      IS_PRODUCTION &&
        VitePluginFigmaTokensParser({
          mode: { enforce: "post", apply: "build" },
          paths: {
            input: "./src/tokens/output",
            output: "./src/tokens/.figma",
          },
        }),
      lightningcss({
        browserslist: [">0.2%", "not dead"],
        minify: true,
      }),
      dts({
        tsconfigPath: path.resolve(__dirname, "tsconfig.types.json"),
        outDir: "dist",
        insertTypesEntry: true,
        include: ["src"],
        exclude: ["src/**/*.stories.*", "src/**/__tests__/**", "src/stories"],
        copyDtsFiles: true,
        staticImport: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      dedupe: ["vue"],
    },
    optimizeDeps: {
      include: ["vue", "vue-router", "pinia"],
      exclude: ["dompurify"],
    },
    build: {
      lib: {
        // entry: {
        //   index: path.resolve(__dirname, "src/index.ts"),
        //   adapters: path.resolve(__dirname, "src/adapters/index.ts"),
        //   assets: path.resolve(__dirname, "src/assets/index.ts"),
        //   components: path.resolve(__dirname, "src/components/index.ts"),
        //   composables: path.resolve(__dirname, "src/composables/index.ts"),
        //   constants: path.resolve(__dirname, "src/constants/index.ts"),
        //   stores: path.resolve(__dirname, "src/stores/index.ts"),
        //   tokens: path.resolve(__dirname, "src/tokens/index.ts"),
        //   typings: path.resolve(__dirname, "src/typings/index.ts"),
        //   utils: path.resolve(__dirname, "src/utils/index.ts"),
        // },
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "AlmaDesignSystem",
        formats: ["es", "cjs"],
        fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      },
      rollupOptions: {
        external: [
          "vue",
          "pinia",
          "vue-router",
          "alma-icons",
          "@alma/tokens/",
          "gsap",
          "vue3-lottie",
        ],
        output: {
          // chunkFileNames: "[name].[hash].cjs",
          // entryFileNames: "[name].cjs",
          preserveModules: false,
          preserveModulesRoot: "src",
          globals: { vue: "Vue" },
          assetFileNames: (info) =>
            info.name?.endsWith(".css")
              ? "style.css"
              : "assets/[name]-[hash][extname]",
          manualChunks(id) {
            if (id.includes("dompurify")) return "dompurify";
            if (id.includes("/tokens/output/")) return "tokens";
          },
        },
      },
      cssCodeSplit: false,
      sourcemap: false,
      target: "es2019",
      emptyOutDir: true,
      outDir: "dist",
      // cssMinify: "lightningcss",
    },
    css: {
      // transformer: "lightningcss",
      // lightningcss: {
      //   drafts: {
      //     customMedia: true,
      //   },
      // },
      modules: {
        generateScopedName: "[hash:base64:5]",
        scopeBehaviour: "local",
        localsConvention: "camelCaseOnly",
      },
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `
            @use "@/index" as *;
          `,
        },
      },
    },
  });
};
