/// <reference types="vitest/config" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', 
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
     coverage: {
      provider: 'v8',
        reporter: ['text'],
        include: ['src/**/*.ts'],
        exclude: [
          "src/utils/static.ts"

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