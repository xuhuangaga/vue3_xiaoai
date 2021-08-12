<template>
  <div class=" m-t10 p-l-r20">
    <div v-for="(item, index) in list" :key="index">
      <div>{{ item.attr_name }}</div>
      <div v-if="item.attr_vals" class="m-t-b10">
        <template
          v-for="(item1, index1) in item.attr_vals.split(',')"
          :key="index1"
        >
          <el-tag class="m-r10" v-if="item1">{{ item1 }}</el-tag>
        </template>
      </div>
      <div v-else class="m-t-b10 f-s14 f-c-9">
        暂无属性
      </div>
    </div>
    <el-button type="success" size="small" @click="next">下一步</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import api from "@/http/api";

export default defineComponent({
  props: {
    catid: {
      type: String,
      required: true
    },
    active: {
      type: Number
    }
  },
  emits: ["next"],
  setup(props, ctx) {
    // 声明变量开始
    let list = ref<any>(null);
    // 声明变量结束
    // 声明方法开始
    //根据分类获取商品参数
    const getAttrs = () => {
      // console.log(props.active );
      if (props.catid) {
        let arr = props.catid.split(",");
        api
          .getAttributes({
            id: Number(arr[arr.length - 1]),
            sel: props.active === 1 ? "only" : "many"
          })
          .then((res: any) => {
            // console.log(res);
            if (res.meta.status === 200) {
              list.value = res.data;
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    };
    //点击下一步
    const next = () => {
      ctx.emit("next",list.value);
    };
    // 声明方法结束
    //页面加载
    onMounted(() => {
      getAttrs();
    });
    return {
      list,
      next
    };
  }
});
</script>

<style scoped>
</style>