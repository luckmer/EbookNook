/// <reference types="vitest/config" />

import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@foliate': path.resolve(__dirname, './src/foliate'),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})