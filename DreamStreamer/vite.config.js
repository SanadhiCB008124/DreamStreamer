import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer/', // Alias buffer to use a browser-compatible version
    },
  },
  define: {
    global: 'window', // Define global as window
  },
})
