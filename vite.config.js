import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 讓打包後的檔案可直接部署到 GitHub Pages 的任意子路徑
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
