<template>
  <div class="f-j-b m-lr10 p-l-r20 wbfb">
    <div class="f-s20">
      欢迎来到小爱后台系统
    </div>
    <div class="f-a-c">
      <div>{{ dataTime }}</div>
      <div class="m-lr10">亲爱的,{{ userName }}</div>
      <div class="exit c-p" @click="signOut">退出</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default defineComponent({
  setup() {
    //声明变量开始
    //时间+日期
    let dataTime = ref<string>("");
    //用户名
    let userName = ref<string>("");
    let router = useRouter();
    //声明变量结束
    //方法开始
    const timer = () => {
      setInterval(() => {
        dataTime.value =
          new Date().toLocaleString() + " ".charAt(new Date().getDay());
      }, 1000);
    };
    //退出登录
    const signOut = () => {
      localStorage.removeItem("user");
      router.push("/login");
      //清除本地的tags
      localStorage.removeItem('tags')
      ElMessage.success("欢迎下次光临");
    };
    //方法结束
    //页面加载
    onMounted(() => {
      //获取用户名
      const user = JSON.parse(localStorage.getItem("user")!);
      userName.value = user.username;
      dataTime.value =
        new Date().toLocaleString() + " ".charAt(new Date().getDay());
      timer();
    });
    //页面销毁
    onUnmounted(() => {
      clearInterval(timer as any);
    });
    return {
      dataTime,
      userName,
      signOut
    };
  }
});
</script>

<style scoped>
.exit {
  color: #409eff;
}
</style>