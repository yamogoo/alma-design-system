"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var node_path_1 = require("node:path");
exports.default = (0, vite_1.defineConfig)({
    build: {
        lib: {
            entry: node_path_1.default.resolve(__dirname, "src/index.ts"),
            name: "AlmaTokens",
            formats: ["es", "cjs"],
            fileName: function (format) { return (format === "es" ? "index.js" : "index.cjs"); },
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
