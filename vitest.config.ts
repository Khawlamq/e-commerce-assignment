import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()], 
  test: {
    environment: 'jsdom', 
    globals: true,
    server: {
      deps: {
        inline: ['@vue', '@vueuse', 'vuetify']
      }
    },
    watch: false,
    pool: 'forks'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})