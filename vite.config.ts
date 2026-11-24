import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
    // Guarantee a single React instance.
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Pages are lazy-loaded, so Vite would otherwise discover their
    // dependencies late and re-bundle mid-session (mixing React copies).
    // Crawling every source file up front avoids that.
    entries: [
      'index.html',
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/testing/**',
      '!src/**/__tests__/**',
    ],
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 4173,
  },
  build: {
    rollupOptions: {
      output: {
        // Long-term-cacheable vendor chunks.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/.test(id))
            return 'react';
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('radix-ui') || id.includes('@radix-ui')) return 'radix';
          return undefined;
        },
      },
    },
  },
});
