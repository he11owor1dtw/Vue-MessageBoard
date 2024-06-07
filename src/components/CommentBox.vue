<template>
  <!-- 留言區 -->
  <form action="" class="grid" @submit="handleSubmit">
    <!-- 用戶在輸入内容時，使用 content 捕捉輸入的內容 -->
    <textarea v-model="content" name="comment" id="" placeholder="請輸入你的評論" class="bg-gray-50 p-2 rounded-xl"></textarea>
    <fieldset class="py-4">
      <input type="submit" value="留言" class="px-4 py-1 bg-blue-600 rounded text-white">
      <input type="reset" value="取消" class="px-4 py-1 bg-yellow-400 rounded border ml-3">
    </fieldset>
  </form>
</template>

<script setup>
import { ref } from "vue";

const content = ref("");

// 使用 defineEmits 定義事件
const emit = defineEmits(["submit"]);

// 提交處理函數
const handleSubmit = (e) => {
  e.preventDefault();
  emit("submit", content.value);
  content.value = "";
};

</script>

<style></style>