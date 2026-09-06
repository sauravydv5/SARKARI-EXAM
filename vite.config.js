import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'router-vendor';
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('dompurify')) return 'sanitizer';
            return 'vendor';
          }
          const contentMatch = id.match(/\/content\/([^/]+)\//);
          if (contentMatch) return `content-${contentMatch[1]}`;
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
