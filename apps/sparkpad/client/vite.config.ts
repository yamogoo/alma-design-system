import { defineConfig, loadEnv } from "vite";

import process from "node:process";
import path from "path";
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";

import svgLoader from "vite-svg-loader";
import babel from "vite-plugin-babel";
import packageJson from "./package.json";
import vueRouter from "unplugin-vue-router/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";

import VueRouterPlugin from "unplugin-vue-router/vite";

export default (opts: { mode: string }) => {
  const { mode } = opts;
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const port = parseInt(process.env.VITE_CLIENT_PORT ?? "3000");
  const AUTH_API_PORT = parseInt(process.env.VITE_AUTH_API_PORT ?? "3001");

  return defineConfig({
    server: {
      host: process.env.VITE_CLIENT_HOST,
      port: port,
      proxy: {
        "/api": {
          target: `http://localhost:${AUTH_API_PORT}`,
          changeOrigin: true,
        },
      },
      fs: {
        allow: ["../.."],
        strict: true,
      },
    },
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
      "import.meta.env.VITE_APP_NAME": JSON.stringify(packageJson.name),
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version),
      "import.meta.env.VITE_APP_AUTHOR_NAME": JSON.stringify(
        packageJson.author.name
      ),
      "import.meta.env.APP_AUTHOR_FULL_NAME": JSON.stringify(
        packageJson.author.fullName
      ),
      "import.meta.env.APP_AUTHOR_EMAIL": JSON.stringify(
        packageJson.author.email
      ),
      "import.meta.env.APP_AUTHOR_URL": JSON.stringify(packageJson.author.url),
    },
    plugins: [
      babel(),
      vue(),
      vueJsx({
        transformOn: true,
        mergeProps: true,
      }),
      vueRouter(),
      VueRouterPlugin({
        dts: true,
      }),
      svgLoader({ defaultImport: "component" }),
      // Generate locales JSON from directory structure
    ],
    optimizeDeps: {
      include: ["@vue/babel-plugin-jsx"],
    },
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment",
    },
    build: {
      cssCodeSplit: true,
      minify: "terser",
      sourcemap: false,
      chunkSizeWarningLimit: 1024,
      outDir: path.resolve(__dirname, "dist/client"),
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, "index.html"),
        output: {},
        external: [],
      },
    },
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
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
            /* * * Design System * * */
            @use "@alma/design-system/core.scss" as *;

            /* * * App * * */
            @use "@/index" as app;
          `,
        },
      },
    },
  });
};
