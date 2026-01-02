import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/JessicaClinic/', // GitHub Pages repository name
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://6957dbf51d1643cf129703cd--jessicaclinic.netlify.app/.netlify/functions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

