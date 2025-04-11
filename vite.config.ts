import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Adjust this port to match your backend server
        changeOrigin: true,
        secure: false,
      }
    },
    port: 5173 // This is Vite's default port
  }
})
