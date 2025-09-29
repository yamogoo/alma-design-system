import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import { fileURLToPath, URL } from "node:url";

import svgLoader from "vite-svg-loader";
import lightningcss from "vite-plugin-lightningcss";
import dts from "vite-plugin-dts";

import {
  ColorsGeneratorPlugin,
  TokensParserPlugin,
  VitePluginTokenLinter,
  VitePluginFigmaTokensParser,
} from "@alma/tokens-worker";

export default () => {
  return defineConfig({
    cacheDir: "../../.vite",
    plugins: [
      vue(),
      vueJsx({
        transformOn: true,
        mergeProps: true,
      }),
      svgLoader({ defaultImport: "component" }),
      // Deign System: Tokens and SCSS generation
      ColorsGeneratorPlugin({
        source: "./src/tokens/src/baseColors.json",
        outDir: "./src/tokens/src/colors.json",
        step: 40,
      }),
      TokensParserPlugin({
        source: "./src/tokens/.cache",
        build: "./src/tokens/output",
        outDir: "./src/assets/scss/abstracts",
        entryFilePath: "./src/tokens/index.ts",
        paths: ["./src/tokens/src/", "./src/tokens/.cache"],
        mapOptions: {
          convertCase: true,
          includeFileName: false,
          convertToCSSVariables: false,
          includeFileNameToCSSVariables: true,
          excludeCSSVariables: ["./src/tokens/.cache/themes.json"],
        },
        themesDir: "./src/tokens/output/themes.json",
        themesOutFile: "./src/assets/scss/abstracts/_runtime_themes.scss",
        themesIncludeRequired: true,
        builder: {
          format: "json",
          paths: ["./src/tokens/src"],
          includeRootDirName: false,
        },
        useReflectOriginalStructure: false,
      }),
      VitePluginTokenLinter({
        source: "./src/tokens/src",
      }),
      VitePluginFigmaTokensParser({
        source: "./src/tokens/output",
        outDir: "./src/tokens/.figma",
      }),
      lightningcss({
        browserslist: [">0.2%", "not dead"],
        drafts: { nesting: true },
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
        "@alma/tokens/": fileURLToPath(
          new URL("./src/tokens", import.meta.url)
        ),
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
        external: ["vue", "pinia", "vue-router", "alma-icons", "@alma/tokens/"],
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
