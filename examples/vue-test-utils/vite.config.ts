import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    css: !process.env.CI,
    setupFiles: './test/setup.ts',
    testTimeout: 10000, // 10 seconds
  },
});
