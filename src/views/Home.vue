<template>
  <div class="f-j-c h-b">
    <div class="f-s25 f-w-b title">欢迎来到小爱后台管理系统</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import store from "@/store/index";

export default defineComponent({
  setup() {
    //页面加载
    onMounted(() => {
      if (!localStorage.getItem("tags")) {
        let tags = [
          {
            name: "首页",
            path: "/"
          }
        ];
        localStorage.setItem("tags", JSON.stringify(tags));
        store.commit("setTags", tags);
      }
    });
    return {};
  }
});
</script>

<style scoped lang="scss">
.h-b {
  .title {
    margin-top: 100px;
  }
}
</style>