<template>
  <el-card class="wbfb">
    <div class="alert-b">
      <el-alert
        title="消息提示的文案"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <el-steps :active="active" finish-status="success" class="m-t20">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    </div>
    <el-tabs tab-position="left" v-model="tabName" @tab-click="tabClick">
      <el-tab-pane label="基本信息" name="0" :disabled="!(active >= 0)">
        <div class="p-t20">
          <one v-model:goods="goods" v-model:active="active" @next="next"></one>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1" :disabled="!(active >= 1)"
        ><two
          :active="1"
          @next="next"
          v-if="goods.goods_cat"
          :catid="goods.goods_cat"
        ></two
      ></el-tab-pane>
      <el-tab-pane label="商品属性" name="2" :disabled="!(active >= 2)">
        <two
          :active="2"
          @next="next"
          v-if="goods.goods_cat"
          :catid="goods.goods_cat"
        ></two
      ></el-tab-pane>
      <el-tab-pane label="商品图片" name="3" :disabled="!(active >= 3)">
        <three @next="next" @upLoad="upLoad"></three
      ></el-tab-pane>
      <el-tab-pane label="商品内容" name="4" :disabled="!(active >= 4)">
        <four @submit="submit"></four>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import store from "@/store/index";
import { isEqual, uniqWith } from "lodash";
import one from "@/components/goods/addgoodsone/addgoodsone.vue";
import two from "@/components/goods/addgoodstwo/addgoodstwo.vue";
import three from "@/components/goods/addgoodsthree/addgoodsthree.vue";
import four from "@/components/goods/addgoodsfour/addgoodsfour.vue";
import api from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
import {useRouter} from 'vue-router'
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
  pics: object;
}
interface attrObj {
  attr_id: number;
  attr_name: string;
  attr_sel: string;
  attr_vals: string;
  attr_write: string;
  cat_id: number;
  delete_time: number | null;
  inputVisible: boolean;
}
export default defineComponent({
  //引入子组件
  components: {
    one,
    two,
    three,
    four
  },
  setup() {
    //声明变量开始
    let router =useRouter()
    let active = ref<number>(0);
    //选中的tab名称
    let tabName = ref<string>("");
    //商品分类
    let goods = ref<obj>({
      goods_id: 0,
      cat_id: null,
      cat_one_id: null,
      cat_three_id: null,
      cat_two_id: null,
      goods_name: "",
      goods_number: "",
      goods_price: "",
      goods_state: "",
      goods_weight: "",
      hot_mumber: 0,
      is_promote: false,
      upd_time: 0,
      time: "",
      goods_cat: "",
      pics: {}
    });
    //商品参数 动态参数+静态属性
    let attrsArr = ref<attrObj[]>([]);
    // 声明变量结束
    // 声明方法开始
    //点击下一步
    const next = (attrs?: attrObj[]) => {
      if (active.value++ > 5) active.value = 0;
      tabName.value = active.value + "";
      if (attrs && attrs.length > 0) {
        attrsArr.value = attrsArr.value.concat(attrs);
      }
    };
    //添加标签
    const addTags = () => {
      let tags = [];
      //存储标签
      let t = localStorage.getItem("tags");
      if (t) {
        tags = JSON.parse(t);
      }
      tags.push({
        name: "添加商品",
        path: "/addgoods"
      });
      //去重
      tags = uniqWith(tags, isEqual);

      localStorage.setItem("tags", JSON.stringify(tags));
      store.commit("setTags", tags);
    };
    //上传文件成功后的分发事件
    const upLoad = (val: any) => {
      goods.value.pics = val;
    };
    //提交 添加商品 分发事件
    const submit = (val: string) => {
      console.log(attrsArr.value);
      api
        .addGoods({
          goods_name: goods.value.goods_name,
          goods_cat: goods.value.goods_cat,
          goods_price: Number(goods.value.goods_price),
          goods_number: Number(goods.value.goods_number),
          goods_weight: Number(goods.value.goods_weight),
          goods_introduce: val,
          pics: goods.value.pics,
          attrs: attrsArr.value
        })
        .then((res: any) => {
          // console.log(res);
          if (res.meta.status === 201) {
            ElMessage({
              type: "success",
              message: res.meta.msg
            });
            //商品添加成功跳转至商品列表
            router.push('/goods')
          }else {
             ElMessage({
              type: "error",
              message: res.meta.msg
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    const tabClick=(e:any)=>{
      active.value=Number(e.index);
    }
    // 声明方法结束
    //页面加载
    onMounted(() => {
      addTags();
    });
    return {
      active,
      goods,
      next,
      tabName,
      upLoad,
      submit,
      tabClick
    };
  }
});
</script>

<style scoped lang="scss">
.alert-b {
  padding-left: 120px;
}
</style>