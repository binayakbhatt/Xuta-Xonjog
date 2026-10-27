import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/xuta-xonjog/', // Update this to match your EXACT GitHub repository name if it's different!
})
