<template>
  <div calss="m-t10 p-l-r20 p-t20">
    <div id="editor" class="m-t20"></div>
    <div class="m-t20">
      <el-button type="success" size="small" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import E from "wangeditor";

export default defineComponent({
  emits: ["submit"],
  setup(props, ctx) {
    // 声明变量开始
    let content = ref<string>(' ')
    // 声明变量结束
    // 声明方法开始
    const submit = () => {
       ctx.emit("submit",content.value);
    };
    // 声明方法结束
    //页面加载
    onMounted(() => {
      content.value=" "
      const editor = new E("#editor");
      editor.config.onchange = (newHtml: any)=> {
        content.value=newHtml
      };
      editor.create();
    });
    return {
      submit
    };
  }
});
</script>

<style scoped>
</style>