import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      "nonvertical-unindicted-ramiro.ngrok-free.dev"
    ],
    //allow all hosts
    // allowedHosts: "all",
    proxy: {
      '/api': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080',
      '/profileImages': 'http://localhost:8080',
      '/vendorImages': 'http://localhost:8080',
    },
  },
})