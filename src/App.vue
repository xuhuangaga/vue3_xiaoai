<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
<script>
import { ElConfigProvider } from "element-plus";
import { defineComponent } from "vue";
import * as echarts from 'echarts'
import { provide } from 'vue'

import zhCn from "element-plus/lib/locale/lang/zh-cn";
export default defineComponent({
  components: {
    [ElConfigProvider.name]: ElConfigProvider
  },
  setup() {
    provide('ec',echarts)//provide
    return {
      locale: zhCn
    };
  }
});
</script>
<style lang="scss">
@import "./styles/pub";
@import "./styles/common";
</style>
