<template>
  <el-container>
    <el-header class="f-a-c header-b">
      <top></top>
    </el-header>
    <el-container>
      <el-aside style="width:200px" class="p-f">
        <left></left>
      </el-aside>
      <el-main>
            <tags></tags>
        <div class="m-t10">
          <router-view>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import top from "@/components/top/top.vue";
import left from "@/components/left/left.vue";
import tags from "@/components/tags/tags.vue";

export default defineComponent({
  //引入子组件
  components: {
    top,
    left,
    tags
  },
  setup() {
    //声明变量开始

    //声明变量结束

    return {
      top
    };
  }
});
</script>

<style scoped lang="scss">
.el-main {
  border-top: 1px solid #eee;
  margin-left: 200px;
}
.header-b {
  position: fixed;
    z-index: 999;
    background: #fff;
    width: 100%;
    top: 0;
}
.el-container {
  margin-top: 30px;
}
</style>