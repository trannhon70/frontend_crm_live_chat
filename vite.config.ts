import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  define: {
    'process.env': {},
    global: 'window', // 👈 GIẢ LẬP global bằng window
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    allowedHosts: ['tuvan.andongclinic.vn'],
    host: true, // Cho phép truy cập từ mọi host
    
  },
  base: './', // Đảm bảo đúng base path khi deploy
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // ✅ đảm bảo CSS/JS nằm trong dist/assets/
  },
  optimizeDeps: {
    include: ['moment', 'moment/locale/vi']
  }
  
})
