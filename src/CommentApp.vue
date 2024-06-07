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
        <ReplyBox @submit="addReply($event, comment.id)"/>
        <!-- 
        當 submit 事件觸發時，調用 addReply 方法，傳入回覆內容（$event）和當前評論的 ID（comment.id）
        $event 事件數據，即 CommentBox 傳遞過來的用戶輸入的回覆內容，
        第二個參數是當前評論的 ID，針對這一條留言的回覆。 
        -->
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
    user: "Jenny",
    avatar: face1,
    time: "5小時之前",
    content:
      "哇！這篇真是寫的太好了，收到很大的啟發，希望能夠繼續產出更多優質內容！",
    replies: [
      {
        id: 2,
        user: "Henry",
        avatar: face2,
        time: "4小時之前",
        content: "認同！",
      },
      {
        id: 3,
        user: "Oscar",
        avatar: face3,
        time: "1小時之前",
        content:
          "這篇寫的非常好，兼具專業與實務方面，也有自己的看法，真的是非常好的文章。",
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

const addReply = (content, id) => {
  // 接收兩個參數：content 和 id，content 是回覆的內容，id 是評論的唯一標識符，用來確定要回覆哪一條評論
  const reply = constructNewComment(content);
  // constructNewComment 是一個函數，用來生成一個新的回覆對象。
  // 該函數接收 content 作為參數，並返回一個包含回覆內容及其他訊息（如時間、用戶、ID 等）的對象。  
  
  let comment = comments.value.find((comment) => comment.id === id);
  // 根據傳入的 id，找到對應的評論對象，準備將新的回覆添加到這個評論的回覆列表中。

  if (comment.replies) {
    comment.replies.push(reply);
    // 如果 replies 屬性存在，則表示該留言已有回覆，將新生成的回覆 reply 新增到 replies 陣列中
  } else {
    comment.replies = [reply];
    // 如果 replies 屬性不存在，代表這是該留言的第一個回覆，將 replies 初始化為一個包含新回覆的陣列。
  }
};

</script>

<style></style>