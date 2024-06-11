import { proxyRefs } from 'vue';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Tailwind CSS 會掃描 index.html 文件並自動移除未使用的樣式
    "./src/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  server: {
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
}

