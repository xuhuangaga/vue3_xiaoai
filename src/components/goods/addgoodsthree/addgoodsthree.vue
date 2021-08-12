<template>
  <div class="m-t10 p-l-r20 p-t20">
    <el-upload
      class="upload-demo"
      drag
      action="/api/upload"
      multiple
      :on-success="onSuccess"
      :headers="headers"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">
          只能上传 jpg/png 文件，且不超过 500kb
        </div>
      </template>
    </el-upload>
    <div class="m-t20">
      <el-button type="success" size="small" @click="next">下一步</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  emits: ["next", "upLoad"],
  setup(props, ctx) {
    let token = localStorage.getItem("token");
    // 声明变量开始
    let headers = ref<any>({
      Authorization: token
    });
    // 声明变量结束
    // 声明方法开始
    //文件上传成功的钩子函数
    const onSuccess = (res: any) => {
      // console.log(res);
      if (res.meta.status === 200) {
        ctx.emit("upLoad", res.data);
      }
    };
    // 声明方法结束
    //点击下一步
    const next = () => {
      ctx.emit("next");
    };
    return {
      next,
      onSuccess,
      headers
    };
  }
});
</script>

<style scoped>
</style>