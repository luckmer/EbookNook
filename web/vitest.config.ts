/// <reference types="vitest/config" />

import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@foliate': path.resolve(__dirname, './src/foliate'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
        reporter: ['text'],
        include: ['src/**/*.ts'],
        exclude: [
          'src/foliate/**',
          'src/**/*.test.ts',
          'src/**/*.d.ts',
          'src/store/selectors/**',
          'src/interfaces/**',
          "src/language/**",
          "src/utils/static.ts",
          "src/utils/regex.ts",
          "src/store/reducers/**/config.ts",

        ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})