import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    origin: 'https://3001-victorgomez09-virapaas-8olzrw9azzg.ws-eu105.gitpod.io'
  }
})
