import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})
//- vue.config.js/vite.config.js   保存vue配置的文件，如代理，端口的配置等
