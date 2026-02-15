import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['server/scoring/**'],
      thresholds: {
        statements: 90,
        branches: 85,
      },
    },
  },
});
