import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: './src/manifest.json',
      watchFilePaths: ['src/**/*']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
