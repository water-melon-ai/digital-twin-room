import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to IPv4 explicitly. On some machines "localhost" resolves to the
    // IPv6 address (::1) while something else already holds the IPv4 one,
    // which is a classic "server is running but Chrome shows nothing" cause.
    host: '127.0.0.1',
    port: 5173,
  },
})
