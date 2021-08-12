<template>
  <div class="f-j-c a-c p-t20">
    <div class="m-r20">
      <img src="../../assets/404.jpg" title="页面找不到了..." />
    </div>
    <div>
      <div class="title f-s20 m-b20">抱歉！页面无法访问……</div>
      <div class="content f-s12 f-c-9">
        <div class="m-b10">可能因为：</div>
        <div class="f-a-c">
          <div class="f-c-6">网址有错误></div>
          <div>请检查地址是否完整或存在多余字符</div>
        </div>
        <div class="f-a-c">
          <div class="f-c-6">网址已失效></div>
          <div>可能页面已删除，活动已下线等</div>
        </div>
        <div class="f-a-c m-t10">
          <div>或者逛逛：</div>
          <div class="c-p" style="color:rgb(89, 161, 211)" @click="goHome">首页</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router/index";

export default defineComponent({
  setup() {
    //去首页
    const goHome = () => {
      router.push("/");
    };

    return {
      goHome
    };
  }
});
</script>