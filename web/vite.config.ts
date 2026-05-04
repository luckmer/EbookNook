import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPath from 'vite-tsconfig-paths'

const host = process.env.TAURI_DEV_HOST

const foliatePDFPlugin = () => {
  return {
    name: 'pdf-vendor-url',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (id.includes('foliate') && id.endsWith('pdf.js')) {
        return code.replace(/new URL\(`vendor\/pdfjs\//g, 'new URL(`./vendor/pdfjs/')
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tsconfigPath(), foliatePDFPlugin() as any],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}))
