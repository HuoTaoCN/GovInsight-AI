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
        // 如果你本地运行了 wrangler dev，默认端口通常是 8788
        // 如果使用 wrangler pages dev，则不需要此代理，因为它会托管整个应用
        target: 'http://localhost:8788', 
        changeOrigin: true,
      }
    }
  }
})
