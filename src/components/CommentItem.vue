<template>
  <div class="flex">
    <!-- 即使在 public 文件夾下，也需要使用 / 絕對路徑引用它下面的文件，省略 Public -->
    <img src="/images/face1.png" alt="" class="w-12 h-12 mr-4 rounded-full" /> <!-- rounded-full 方形變圓形 -->
    <div>
      <p>機器人 1 號</p>
      <p class="text-gray-600 text-sm">18 小時之前</p>
    </div>
    <!-- 三點圖標：flex 佈局下 ml-auto 向右對齊 -->
    <span class="ml-auto">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </span>
  </div>
  <p class="text-gray-600 py-4">
    哇！這篇文章真是寫的太好啦！收到很大的啟發，希望你再接再厲，發表越來越多文章！
  </p>
</template>

<script setup>
</script>

<style></style>