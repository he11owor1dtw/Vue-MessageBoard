<template>
  <main class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
      <h2 class="text-3xl my-6">說說你的想法吧</h2>
      <CommentBox />
      <!-- 分隔線 -->
      <DividerHorizontal />
      <!-- 留言區 -->
      <div>
        <CommentItem />
        <!-- 回覆區 -->
        <ReplyBox>
          <!-- 回覆內容 -->
          <CommentItem />
        </ReplyBox>
      </div>
    </div>
  </main>
</template>

<!-- 有 setup 就不用 export，反之需要 export 給組件使用 -->
<script setup>
import CommentBox from "./components/CommentBox.vue";
import CommentItem from "./components/CommentItem.vue";
import DividerHorizontal from "./components/DividerHorizontal.vue";
import ReplyBox from "./components/ReplyBox.vue";

</script>

<style></style>