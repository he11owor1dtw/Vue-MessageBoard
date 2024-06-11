import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    // 專案啟動後自動打開瀏覽器
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        // 設置對象為 "/api" ，對於所有 /api 的請求都交由這個代理去處理
        changeOrigin: true,
        // 設置 changeOrigin 為 true，發送請求的時候修改請求的 origin，避免跨域
        rewrite: (path) => path.replace(/^\/api/, ""),
        // 設置 rewrite，把實際請求的 /api 這段去掉，後端的服務 URL 中，沒有 /api 這一段，
        // 只是方便前端區分是否爲調用後端的 URL
      },
    },
  },
})

// 這段 Vite 配置文件的用意是設定 Vite 專案的配置，並啟用 Vue 插件來支持 Vue.js 開發

// defineConfig 是 Vite 提供的一個函數，用來幫助我們更好地書寫和管理配置文件。
// 它會自動提供類型提示和檢查，讓我們更方便地配置 Vite。
// plugins: [vue()] 這行代碼的作用是將 Vue 插件加到 Vite 的插件配置中，
// 這樣 Vite 就知道要處理 Vue 文件（即.vue 文件）。
// Vue 插件會讓 Vite 能夠識別、解析和編譯 Vue 組件，從而支持 Vue 框架的開發。
