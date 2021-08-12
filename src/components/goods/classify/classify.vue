<template>
  <el-cascader
    v-model="value"
    :options="options"
    @change="handleChange"
    :disabled="disabled"
    v-if="!isHover"
    :props="propsHover"
  >
    <template #default="{ node, data }">
      <span>{{ data.cat_name }}</span>
    </template>
  </el-cascader>
  <el-cascader
    v-model="value"
    :options="options"
    @change="handleChange"
    :disabled="disabled"
    :props="propsHover"
    v-else
  >
    <template #default="{ node, data }">
      <span>{{ data.cat_name }}</span>
    </template>
  </el-cascader>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "@/http/api";
interface obj {
  children: any;
  cat_id: number;
  cat_name: string;
}
export default defineComponent({
  props: {
    type: {
      type: String,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isHover: {
      type: Boolean,
      default: false
    }
  },
  emits: ["change"],
  setup(props, ctx) {
    // 声明变量开始
    let value = ref<string[]>([]);
    let options = ref<obj[]>([]);
    let propsHover = {
      expandTrigger: props.isHover ? "hover" : "",
      children: "children",
      value: "cat_id",
      label: "cat_name",
      checkStrictly: props.isHover ? true :false
    };
    // 声明变量结束
    // 声明方法开始
    const handleChange = (value: number) => {
      // console.log(value);
      ctx.emit("change", value);
    };
    //获取所有商品分类
    const getClassify = () => {
      api
        .getCategories({
          type: Number(props.type),
          pagenum: null,
          pagesize: null
        })
        .then((res: any) => {
          options.value = res.data;
          options.value.map((item: obj) => {
            if (item.children) {
              item.children.map((item1: obj) => {
                if (props.isHover) {
                  item1.children = undefined;
                }
              });
            }
          });
          // console.log(options.value);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    // 声明方法结束
    //页面加载
    onMounted(() => {
      getClassify();
    });
    return {
      handleChange,
      options,
      value,
      propsHover,
      getClassify
    };
  }
});
</script>

<style scoped>
</style>