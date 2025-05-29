import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 0,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**', '*.config.*', '**/public/**'],
    },
  },
});
