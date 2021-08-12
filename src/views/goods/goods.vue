<template>
  <el-card class="wbfb">
    <div class="f-a-c">
      <el-input
        placeholder="请输入搜索内容"
        v-model="search"
        class="input-with-select m-r20 ipt-d"
        :clearable="true"
      >
        <template #append>
          <el-button icon="el-icon-search" @click="select"></el-button>
        </template>
      </el-input>
      <el-button type="primary" @click="add">添加商品</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="true"
      border
      class="m-t20"
    >
      <el-table-column label="#" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="goods_name"
        align="center"
        width="700px"
      >
      </el-table-column>
      <el-table-column label="价格(元)" prop="goods_price" align="center">
      </el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="time" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="del(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 15, 20, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </el-card>
  <el-dialog title="编辑商品" v-model="show" width="50%">
    <el-form :model="goods" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model.trim="goods.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input
          class="goods-el-input-number"
          type="number"
          v-model="goods.goods_price"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input
          class="goods-el-input-number"
          type="number"
          v-model="goods.goods_number"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input
          class="goods-el-input-number"
          v-model="goods.goods_weight"
          type="number"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="roleShow = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import api from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
//商品接口
interface obj {
  goods_id: number;
  cat_id: null;
  cat_one_id: null;
  cat_three_id: null;
  cat_two_id: null;
  goods_name: string;
  goods_number: number;
  goods_price: number;
  goods_state: number;
  goods_weight: number;
  hot_mumber: number;
  is_promote: boolean;
  upd_time: number;
  time: string;
}
export default defineComponent({
  setup() {
    // 声明变量开始
    let router = useRouter();
    //搜索内容
    let search = ref<string>("");
    let goods = ref<obj>({
      goods_id: 0,
      cat_id: null,
      cat_one_id: null,
      cat_three_id: null,
      cat_two_id: null,
      goods_name: "",
      goods_number: 0,
      goods_price: 0,
      goods_state: 0,
      goods_weight: 0,
      hot_mumber: 0,
      is_promote: false,
      upd_time: 0,
      time: ""
    });
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
    //编辑商品弹框是否显示
    let show = ref<boolean>(false);
    //用户数据
    let tableData = ref<obj[]>([]);
    //当前页码
    let pagenum = ref<number>(1);
    //每页显示条数
    let pagesize = ref<number>(5);
    //用户总条数
    let total = ref<number>(0);
    // 声明变量结束
    // 声明方法开始
    //点击添加用户
    const add = () => {
      router.push("/addgoods");
    };
    //搜索
    const select = () => {
      getGoods();
    };
    //获取商品数据
    const getGoods = () => {
      api
        .getGoods({
          query: search.value,
          pagenum: pagenum.value,
          pagesize: pagesize.value
        })
        .then((res: any) => {
          if (res.meta.status === 200) {
            tableData.value = res.data.goods;
            total.value = res.data.total;
            tableData.value.map((item: obj) => {
              item.time = dayjs(item.upd_time).format("YYYY-MM-DD HH-mm-ss");
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //确定编辑商品
    const submit = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          // api
          //   .editGoods({
          //     id: goods.value.goods_id,
          //     goods_name: goods.value.goods_name,
          //     goods_price: goods.value.goods_price,
          //     goods_number: goods.value.goods_number,
          //     goods_weight: goods.value.goods_weight,
          //     goods_introduce: null,
          //     pics: null,
          //     attrs: null
          //   })
          //   .then((res: any) => {
          //     // console.log(res);
          //     const data = res as any;
          //     if (data.meta.status === 200) {
          //       ElMessage.success("更新成功");
          //       show.value = false;
          //     } else ElMessage.error(data.meta.msg);
          //   })
          //   .catch((err: any) => {
          //     console.log(err);
          //   });

          ElMessage.success("更新成功");
          show.value = false;
        }
      });
    };
    //点击编辑用户
    const edit = (row: obj) => {
      goods.value = row;
      show.value = true;
    };
    //删除商品
    const del = (id: number) => {
      ElMessageBox.confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .delGoods({
              id: id
            })
            .then((res: any) => {
              if (res.meta.status === 200) {
                ElMessage({
                  type: "success",
                  message: res.meta.msg
                });
                getGoods();
              }
              console.log(res);
            })
            .catch((err: any) => {
              console.log(err);
            });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消删除"
          });
        });
    };
    //切换页码
    const handleCurrentChange = (val: number) => {
      pagenum.value = val;
      getGoods();
    };
    //切换每页显示条数
    const handleSizeChange = (val: number) => {
      pagesize.value = val;
      getGoods();
    };
    // 声明方法结束
    // 页面加载
    onMounted(() => {
      getGoods();
    });
    return {
      tableData,
      add,
      ruleForm,
      goods,
      rules,
      submit,
      show,
      edit,
      del,
      search,
      select,
      pagesize,
      pagenum,
      handleSizeChange,
      handleCurrentChange,
      total
    };
  }
});
</script>

<style scoped lang="scss">
.ipt-d {
  width: 300px;
}
</style>