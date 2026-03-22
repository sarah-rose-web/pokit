import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  // Expose env vars with VITE_ prefix to the browser bundle
  // Non-VITE_ vars (Groq key, FX key) stay server-side in CF Pages Functions
  envPrefix: 'VITE_',
})
