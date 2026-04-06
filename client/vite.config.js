import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Pisahkan library UI yang mandiri dan sangat besar
            if (
              id.includes('framer-motion') || 
              id.includes('lucide-react') || 
              id.includes('recharts') ||
              id.includes('@react-pdf')
            ) {
              return 'vendor-ui';
            }
            // Gabungkan semua library inti lainnya (React, Axios, Router, dll) 
            // menjadi satu chunk 'vendor' untuk menghindari circular dependency
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5500',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5500',
        changeOrigin: true,
      }
    }
  }
})
