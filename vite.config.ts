import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

import react from '@vitejs/plugin-react-swc';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, './src/client')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Adjust this port to match your backend server
        changeOrigin: true,
        secure: false,
      },
    },
    port: 5173, // This is Vite's default port
  },
});
