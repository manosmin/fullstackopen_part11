import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
      proxy: {
        '/api/persons': 'http://localhost:3001'
      }
    },
   build: {
    outDir: resolve(__dirname, '../phonebook-backend/dist'),
    emptyOutDir: true,
  },
})
