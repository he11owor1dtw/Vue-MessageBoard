<template>
  <main class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
      <h2 class="text-3xl my-6">說說你的想法吧</h2>
      <CommentBox @submit="addNewComment"/>
      <!-- 分隔線 -->
      <DividerHorizontal />
      <!-- 留言區 -->
      <div v-for="comment in comments" :key="comment.id">
        <CommentItem 
        :user="comment.user" 
        :avatar="comment.avatar" 
        :time="comment.time" 
        :content="comment.content" />
        <!-- 回覆區 -->
        <ReplyContainer v-if="comment.replies">
          <!-- 回覆內容 -->
          <CommentItem 
          v-for="reply in comment.replies"
          :key="reply.id"
          :user="reply.user"
          :avatar="reply.avatar" 
          :time="reply.time" 
          :content="reply.content" />
        </ReplyContainer>
        <ReplyBox/>
      </div>
    </div>
  </main>
</template>

<!-- 有 setup 就不用 export，反之需要 export 給組件使用 -->
<script setup>
import { ref } from "vue";

import CommentBox from "./components/CommentBox.vue";
import CommentItem from "./components/CommentItem.vue";
import DividerHorizontal from "./components/DividerHorizontal.vue";
import ReplyBox from "./components/ReplyBox.vue";
import ReplyContainer from "./components/ReplyContainer.vue";

import face1 from "./assets/face1.png";
import face2 from "./assets/face2.png";
import face3 from "./assets/face3.png";
import face4 from "./assets/face4.png";

let rid = ref(4);

// 先定義為常量，之後會定義為 ref
const comments = ref([
  {
    id: 1,
    user: "夢落輕尋",
    avatar: face1,
    time: "2小時之前",
    content:
      "哇！這篇真是寫的太好啦！收到很大的啟發，希望版主能夠再接再厲，產出越來越多內容！",
    replies: [
      {
        id: 2,
        user: "陌上花開",
        avatar: face2,
        time: "2小時之前",
        content: "認同！",
      },
      {
        id: 3,
        user: "半夢半醒半浮生",
        avatar: face3,
        time: "2小時之前",
        content:
          "這篇寫的非常好，無論是技術點還是理論點都非常好，也有自己的看法，真的是非常好的文章。",
      },
    ],
  },
]);

const constructNewComment = (content) => {
  return {
    id: rid.value++,
    user: "目前用戶",
    avatar: face4,
    content,
    time: "1秒前",
  };
};

const addNewComment = (content) => {
  const newComment = constructNewComment(content);
  comments.value.push(newComment);
};
</script>

<style></style>