import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: '/metro-rush-tonight/',
  plugins: [vue(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
