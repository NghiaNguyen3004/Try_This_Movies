import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'https://try-this-movies.onrender.com',
      '/films': 'https://try-this-movies.onrender.com',
    }
  }
})
