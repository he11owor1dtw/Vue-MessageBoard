<template>
  <div class="pl-8 border-l-2 border-gray-200">
    <!-- 父組件自行把回覆結果傳遞過來，這裡在這裡用一個 slot，就不用自己維護回覆列表了 -->
    <slot />
  </div>
  <button class="pt-4 pb-10 text-blue-600">回覆</button>
</template>

<script>
export default {

}
</script>

<style></style>