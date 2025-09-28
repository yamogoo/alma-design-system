import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import { fileURLToPath, URL } from "node:url";

import dts from "vite-plugin-dts";

import svgLoader from "vite-svg-loader";

import {
  ColorsGeneratorPlugin,
  TokensParserPlugin,
  VitePluginTokenLinter,
  VitePluginFigmaTokensParser,
} from "@alma/tokens-worker";

export default () => {
  return defineConfig({
    plugins: [
      vue(),
      vueJsx({
        transformOn: true,
        mergeProps: true,
      }),
      svgLoader({ defaultImport: "component" }),
      // Deign System: Tokens and SCSS generation
      ColorsGeneratorPlugin({
        source: "../tokens/src/src/baseColors.json",
        outDir: "./tokens/src/src/tokens/src/colors.json",
        step: 40,
      }),
      TokensParserPlugin({
        source: "../tokens/src/.cache",
        build: "../tokens/src/build",
        outDir: "./src/assets/scss/abstracts",
        entryFilePath: "../tokens/src/index.ts",
        paths: ["../tokens/src/", "../tokens/src/.cache"],
        mapOptions: {
          convertCase: true,
          includeFileName: false,
          convertToCSSVariables: false,
          includeFileNameToCSSVariables: true,
          excludeCSSVariables: ["../tokens/src/.cache/themes.json"],
        },
        themesDir: "../tokens/src/build/themes.json",
        themesOutFile: "./src/assets/scss/abstracts/_runtime_themes.scss",
        themesIncludeRequired: true,
        builder: {
          format: "json",
          paths: ["../tokens/src/src"],
          includeRootDirName: false,
        },
        useReflectOriginalStructure: false,
      }),
      VitePluginTokenLinter({
        source: "../tokens/src",
      }),
      VitePluginFigmaTokensParser({
        source: "../tokens/src/build",
        outDir: "../tokens/src/.figma",
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
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "AlmaDesignSystem",
        formats: ["es", "cjs"],
        fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      },
      rollupOptions: {
        external: ["vue", "pinia", "vue-router", "alma-icons", "@alma/tokens"],
        output: {
          globals: { vue: "Vue" },
          assetFileNames: (info) =>
            info.name?.endsWith(".css")
              ? "style.css"
              : "assets/[name]-[hash][extname]",
        },
      },
      cssCodeSplit: false,
      sourcemap: true,
      target: "es2019",
      emptyOutDir: true,
      outDir: "dist",
    },
    css: {
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
