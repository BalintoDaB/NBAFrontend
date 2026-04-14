import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {   // Így CORS nélkül hívhatod az API-t.
      '/api': 'http://localhost:3000'
    }
  }
})
