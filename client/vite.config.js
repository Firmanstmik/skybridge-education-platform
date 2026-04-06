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
            // Satukan semua core dependencies (React, Router, dll) untuk menghindari circularity
            if (
              id.includes('react') || 
              id.includes('react-dom') || 
              id.includes('react-router') ||
              id.includes('scheduler') ||
              id.includes('axios')
            ) {
              return 'vendor-core';
            }
            // Pisahkan library UI yang besar
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('recharts')) {
              return 'vendor-ui';
            }
            // Sisanya masuk ke vendor-libs
            return 'vendor-libs';
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
