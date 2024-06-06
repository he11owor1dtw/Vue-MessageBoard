import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";


export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
];

module.exports = {
  extends: [
    // 添加更通用的規則集，例如:
    // 'eslint:recommended',
    "plugin:vue/vue3-recommended",
  ],
  rules: {
    // 在這裡覆蓋/添加規則設置，例如:
    // "vue/no-unused-vars": "error",
    "vue/singleline-html-element-content-newline": "off",
    // 這條規則關閉了單行 HTML 元素內容換行的檢查，這樣在單行中包含內容而不會觸發警告。
  },
};
