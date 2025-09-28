import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "AlmaTokens",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: [],
      output: {
        sourcemap: true,
      },
    },
    emptyOutDir: false,
    sourcemap: true,
    target: "es2019",
    outDir: "dist",
  },
});
