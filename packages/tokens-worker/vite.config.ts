import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node20',
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      external: ['color', 'js-yaml', 'lodash-es', 'chokidar', /^node:/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'lib',
        entryFileNames: '[name].js',
      },
    },
  },
});
