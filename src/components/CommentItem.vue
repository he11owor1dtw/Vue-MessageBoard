<template>
  <div class="flex">
    <!-- 即使在 public 文件夾下，也需要使用 / 絕對路徑引用它下面的文件，省略 Public -->
    <img :src="avatar" alt="" class="w-12 h-12 mr-4 rounded-full" /> <!-- rounded-full 方形變圓形 -->
    <div>
      <p>{{ user }}</p>
      <p class="text-gray-600 text-sm">{{ time }}</p>
    </div>
    <!-- 三點圖標：flex 佈局下 ml-auto 向右對齊 -->
    <span class="ml-auto">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </span>
  </div>
  <p class="text-gray-600 py-4">
    {{ content }}
  </p>
</template>

<script setup>
defineProps(["user", "avatar", "time", "content"]);
// 接收名字、頭像、發布時間、留言内容
</script>

<style></style>