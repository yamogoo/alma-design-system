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
  VitePluginTokenLinter,
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
      // visualizer({ filename: "stats.html", gzipSize: true }),
      vueJsx({
        transformOn: true,
        mergeProps: true,
      }),
      svgLoader({ defaultImport: "component" }),
      // Deign System: Tokens and SCSS generation
      ColorsGeneratorPlugin({
        enforce: "pre",
        apply: "build",
        source: "./src/tokens/src/baseColors.json",
        outDir: "./src/tokens/src/colors.json",
        step: 40,
      }),
      TokensParserPlugin({
        enforce: "pre",
        apply: "build",
        source: "./src/tokens/.cache",
        build: "./src/tokens/output",
        outDir: "./src/assets/scss/abstracts",
        entryFilePath: "./src/tokens/index.ts",
        paths: ["./src/tokens/src/", "./src/tokens/.cache"],
        mapOptions: {
          prefix: "",
          convertCase: true,
          includeFileName: true,
          includeServiceFields: ["value", "respond"],
          scssUseDefaultFlag: true,
        },
        cssVarOptions: {
          prefix: PREFIX,
          convertToCSSVariables: false,
          includeFileNameToCSSVariables: false,
          excludeCSSVariables: ["./src/tokens/.cache/themes.json"],
          useSeparateFile: true,
          fileNamePrefix: "_runtime.",
        },
        themesDir: "./src/tokens/output/themes.json",
        themesOutFile: "./src/assets/scss/abstracts/_runtime_themes.scss",
        themesIncludeRequired: true,
        builder: {
          format: "json",
          paths: ["./src/tokens/src"],
          includeRootDirName: false,
        },
        useFileStructureLookup: false,
        isModulesMergedIntoEntry: true,
      }),

      VitePluginTokenLinter({
        source: "./src/tokens/src",
      }),
      !IS_PRODUCTION &&
        VitePluginFigmaTokensParser({
          enforce: "post",
          apply: "build",
          source: "./src/tokens/output",
          outDir: "./src/tokens/.figma",
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
