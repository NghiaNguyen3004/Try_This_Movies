import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_API_URL || 'https://try-this-movies.onrender.com';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/auth': backendUrl,
        '/films': backendUrl,
      }
    }
  }
})
