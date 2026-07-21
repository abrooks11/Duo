import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        include: [
          'src/client/features/reports/**',
          'src/client/context/reducers/reportReducer.ts',
          'src/server/domains/reports/**',
        ],
      },
    },
  })
);
