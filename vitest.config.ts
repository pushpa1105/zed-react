import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/testing/setup-tests.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      css: false,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/shared/ui/**',
          'src/testing/**',
          'src/mocks/**',
          'src/**/*.d.ts',
          'src/main.tsx',
        ],
      },
    },
  }),
);
