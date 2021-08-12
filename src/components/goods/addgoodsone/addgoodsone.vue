<template>
  <el-form :model="goods" :rules="rules" ref="ruleForm" label-width="120px">
    <el-form-item label="商品名称" prop="goods_name">
      <el-input v-model.trim="goods.goods_name"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" prop="goods_price">
      <el-input
        class="goods-el-input-number"
        type="number"
        v-model="goods.goods_price"
        ref="price"
        :disabled="num === 5"
      ></el-input>
    </el-form-item>
    <el-form-item label="商品重量" prop="goods_weight">
      <el-input
        class="goods-el-input-number"
        v-model="goods.goods_weight"
        type="number"
        ref="weight"
        :disabled="num >=4"
      ></el-input>
    </el-form-item>
    <el-form-item label="商品数量" prop="goods_number">
      <el-input
        class="goods-el-input-number"
        v-model="goods.goods_number"
        type="number"
        ref="number"
        :disabled="num >=3"
      ></el-input>
    </el-form-item>
    <el-form-item label="商品分类">
      <classify type="0" @change="change" :disabled="num >=2"></classify>
    </el-form-item>
    <el-form-item label="" v-if="num === 0">
      <el-button type="success" size="small" @click="next">下一步</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, watch, ref, onMounted } from "vue";
import classify from "@/components/goods/classify/classify.vue";
//商品接口
interface obj {
  goods_id: number;
  cat_id: null;
  cat_one_id: null;
  cat_three_id: null;
  cat_two_id: null;
  goods_name: string;
  goods_number: string;
  goods_price: string;
  goods_state: string;
  goods_weight: string;
  hot_mumber: number;
  is_promote: boolean;
  upd_time: number;
  time: string;
  goods_cat: string;
}
export default defineComponent({
  //引入子组件
  components: {
    classify
  },
  props: {
    goods: {
      type: Object
    },
    active: {
      type: Number,
      default: 0
    }
  },
  emits: ["next", "update:goods"],
  setup(props, ctx) {
    // 声明变量开始
    //验证
    let rules = ref<any>({
      goods_name: [
        { required: true, message: "请输入商品名称", trigger: "blur" }
      ],
      goods_price: [
        { required: true, message: "请输入商品价格", trigger: "blur" }
      ],
      goods_number: [
        { required: true, message: "请输入商品数量", trigger: "blur" }
      ],
      goods_weight: [
        { required: true, message: "请输入商品重量", trigger: "blur" }
      ]
    });
    let ruleForm = ref<any>(null);
    let goods = props.goods as obj;
    //验证通过的数量
    let num = ref<number>(0);
    // 声明变量结束
    //声明方法开始
    //选择商品分类
    const change = (val: any) => {
      goods.goods_cat = val.join();
    };
    //点击下一步
    const next = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          ctx.emit("update:goods", goods);
          ctx.emit("next");
        }
      });
    };
    // 声明方法结束
    //监听
    watch(
      () => [
        goods.goods_name,
        goods.goods_price,
        goods.goods_weight,
        goods.goods_number,
        goods.goods_cat
      ],
      val => {
        // val[] 0:商品名称 1:商品价格 2:商品重量 3:商品数量 4:商品分类
        // 未通过验证的总数量
        if (!val[0]) num.value = 5;
        else if (!val[1]) num.value = 4;
        else if (!val[2]) num.value = 3;
        else if (!val[3]) num.value = 2;
        else if (!val[4]) num.value = 1;
        else num.value = 0;
      },
      { deep: true, immediate: true }
    );
    return {
      rules,
      change,
      ruleForm,
      next,
      num
    };
  }
});
</script>

<style scoped>
</style>