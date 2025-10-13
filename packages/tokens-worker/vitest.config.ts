import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['lib/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
