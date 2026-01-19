import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        // 本地开发时代理到 Express 后端 (Port 3000)
        // 这样即使不通过 Wrangler (8788) 启动，也能直接连接本地后端
        target: 'http://localhost:3000', 
        changeOrigin: true,
      }
    }
  }
})
