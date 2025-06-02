import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()], // Add this line - this was missing!
  test: {
    environment: 'jsdom', // Change from happy-dom to jsdom for better Vue compatibility
    globals: true,
    server: {
      deps: {
        inline: ['@vue', '@vueuse', 'vuetify']
      }
    },
    // Disable HMR during tests
    watch: false,
    // Alternative: set pool to 'forks' to isolate tests
    pool: 'forks'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})