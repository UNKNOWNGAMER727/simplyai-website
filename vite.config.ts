import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/paperclip': {
        target: 'http://localhost:3100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/paperclip/, '/api'),
      },
      '/calcom': {
        target: 'https://api.cal.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/calcom/, '/v2'),
      },
      '/webhook-api': {
        target: 'http://localhost:3200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/webhook-api/, ''),
      },
    },
  },
})
