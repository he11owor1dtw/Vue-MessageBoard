<template>
  <main class="p-4 bg-gray-50 min-h-screen">
    <div class="max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
      <h2 class="text-3xl my-6">說說你的想法吧</h2>
      <CommentBox @submit="addNewComment" />
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
          <CommentItem v-for="reply in comment.replies" 
          :key="reply.id" 
          :user="reply.user" 
          :avatar="reply.avatar"            
          :time="reply.time" 
          :content="reply.content" />
        </ReplyContainer>
        <ReplyBox @submit="addNewComment($event, comment.id)" />
        <!-- 
        當 submit 事件觸發時，調用 addNewComment 方法，傳入回覆內容（$event）和當前評論的 ID（comment.id）
        $event 事件數據，即 CommentBox 傳遞過來的用戶輸入的回覆內容，
        第二個參數是當前回覆的 ID，針對這一條留言的回覆。 
        -->
      </div>
    </div>
  </main>
</template>

<!-- 有 setup 就不用 export，反之需要 export 給組件使用 -->
<script setup>
import { ref, onMounted } from "vue";

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
const comments = ref([]);

async function getAllComments() {
  const res = await fetch("/api/comments");
  comments.value = await res.json();
}

onMounted(() => {
  getAllComments();
});

// 這個函數可以一併處理發表留言和回覆，因爲已經不需要手動維護 comments 這個列表陣列了，只是發送數據給後台，
const addNewComment = async (content, replyTo) => {
  const res = await fetch(`/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      ...(replyTo && { replyTo }),
      // 利用展開運算符，根據 replyTo 是否有值，來決定是否增加 replyTo 屬性
    }),
  });

  const newComment = await res.json();

  if (!replyTo) {
    // 如果 replyTo 是空的，表示這是一條新的留言（而不是回覆）
    comments.value.unshift(newComment);
    // 將新留言 newComment 插入到 comments 列表的開頭（unshift 方法將元素添加到陣列的開頭）
  } else {
    // 反之如果有值，表示這是一條回覆，replyTo 是被回覆的留言 ID
    comments.value.find((c) => c.id === replyTo).replies.unshift(newComment);
    // 在 comments 列表中查找與 replyTo ID 匹配的留言
    // 找到匹配的留言後，將新回覆 newComment 插入到這條留言的 replies 列表開頭
  }

  // 新增完評論後，使用 setTimeout() 再請求獲取新的留言列表
  // Notion API 有延遲，在添加完 page 之後，需要等一下才能讀取到新的評論列表
  // setTimeout(async () => {
  //   await getAllComments();
  // }, 1000);
};

</script>

<style></style>