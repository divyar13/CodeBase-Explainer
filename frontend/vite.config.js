import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.VITE_API_URL || 'http://localhost:5001';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/auth': { target: backendUrl, changeOrigin: true },
        '/api': { target: backendUrl, changeOrigin: true }
      }
    }
  };
});
