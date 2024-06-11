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
  // mode:"jit", Tailwind 3.0 以上，JIT模式已經預設啟動，無須額外設定
}