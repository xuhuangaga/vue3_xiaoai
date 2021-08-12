<template>
  <el-card class="wbfb">
    <div class="f-a-c">
      <el-button type="primary" @click="add">添加分类</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      class="m-t20 expand-table-el-table__expanded-cell"
    >
      <el-table-column label="#" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column type="expand" prop="cat_name" style="padding:0px">
        <template #default="props">
          <el-table
            :data="props.row.children"
            style="width: 100%"
            border
            :show-header="false"
          >
            <el-table-column type="expand" style="padding:0px">
              <template #default="props">
                <el-table
                  :data="props.row.children"
                  style="width: 100%"
                  border
                  :show-header="false"
                >
                  <el-table-column prop="cat_name"> </el-table-column>
                  <el-table-column label="是否有效" align="center">
                    <template #default="scope"
                      ><i
                        class="el-icon-success"
                        v-if="scope.row.cat_level === 0"
                        style="color:skyblue"
                      ></i>
                      <i class="el-icon-error" v-else style="color:#f56c6c"></i>
                    </template>
                  </el-table-column>
                  <el-table-column label="排序" align="center">
                    <template #default="scope">
                      <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                      <el-tag
                        v-else-if="scope.row.cat_level === 1"
                        type="success"
                        >二级</el-tag
                      >
                      <el-tag v-else type="warning">三级</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="180">
                    <template #default="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="edit(scope.row)"
                      >
                        编辑<i class="el-icon-edit"></i>
                      </el-button>
                      <el-button
                        type="danger"
                        size="mini"
                        @click="del(scope.row.cat_id)"
                      >
                        删除<i class="el-icon-delete"></i
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="cat_name"> </el-table-column>
            <el-table-column label="是否有效" align="center">
              <template #default="scope"
                ><i
                  class="el-icon-success"
                  v-if="scope.row.cat_level === 0"
                  style="color:skyblue"
                ></i>
                <i class="el-icon-error" v-else style="color:#f56c6c"></i>
              </template>
            </el-table-column>
            <el-table-column label="排序" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level === 1" type="success"
                  >二级</el-tag
                >
                <el-tag v-else type="warning">三级</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template #default="scope">
                <el-button type="primary" size="mini" @click="edit(scope.row)">
                  编辑<i class="el-icon-edit"></i>
                </el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="del(scope.row.cat_id)"
                >
                  删除<i class="el-icon-delete"></i
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="cat_name"> </el-table-column>
      <el-table-column label="是否有效" align="center">
        <template #default="scope"
          ><i
            class="el-icon-success"
            v-if="scope.row.cat_level === 0"
            style="color:skyblue"
          ></i>
          <i class="el-icon-error" v-else style="color:#f56c6c"></i>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">
            编辑<i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" size="mini" @click="del(scope.row.cat_id)">
            删除<i class="el-icon-delete"></i
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
  <el-dialog :title="title" v-model="show" width="40%">
    <el-form
      :model="category"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
    >
      <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model.trim="category.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类" v-if="title === '添加分类'">
        <classify
          type="0"
          :isHover="true"
          @change="change"
          :disabled="disabled"
          ref="child"
        ></classify>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import api from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
import classify from "@/components/goods/classify/classify.vue";
//用户接口
interface obj {
  cat_deleted: boolean;
  cat_id: number;
  cat_level: number;
  cat_name: string;
  cat_pid: number;
  children: [];
}
export default defineComponent({
  components: {
    classify
  },
  setup() {
    // 声明变量开始
    let child = ref<any>(null);
    //父级分类下拉框是否禁用
    let disabled = ref<boolean>(true);
    let category = ref<obj>({
      cat_deleted: false,
      cat_id: 0,
      cat_level: 0,
      cat_name: "",
      cat_pid: 0,
      children: []
    });
    //验证
    let rules = ref<any>({
      cat_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
    });
    let ruleForm = ref<any>(null);
    let title = ref<string>("");
    //添加/编辑分类弹框是否显示
    let show = ref<boolean>(false);
    //用户数据
    let tableData = ref<obj[]>([]);
    //当前页码
    let pagenum = ref<number>(1);
    //每页显示条数
    let pagesize = ref<number>(5);
    //用户总条数
    let total = ref<number>(0);
    //分类层级
    let cat_level = ref<number>(0);
    //父级id
    let cat_pid = ref<number>(0);
    // 声明变量结束
    // 声明方法开始
    //选择父级分类
    const change = (val: any) => {
      cat_level.value = val.length;
      val.length === 1 ? (cat_pid.value = val[0]) : (cat_pid.value = val[1]);
    };
    //点击添加分类
    const add = () => {
      title.value = "添加分类";
      show.value = true;
      category.value.cat_name = "";
      category.value.cat_id = 0;
      cat_level.value = 0;
      cat_pid.value = 0;
    };
    //获取商品分类数据
    const getCategories = () => {
      api
        .getCategories({
          type: 0,
          pagenum: pagenum.value,
          pagesize: pagesize.value
        })
        .then((res: any) => {
          console.log(res);
          if (res.meta.status === 200) {
            tableData.value = res.data.result;
            total.value = res.data.total;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //确定添加/编辑商品分类
    const submit = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          if (category.value.cat_id) {
            //编辑商品分类
            api
              .editCategory({
                id: category.value.cat_id,
                cat_name: category.value.cat_name
              })
              .then((res: any) => {
                if (res.meta.status === 200) {
                  ElMessage.success("更新成功");
                  show.value = false;
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          } else {
            console.log(
              cat_pid.value,
              category.value.cat_name,
              cat_level.value
            );
            //添加商品分类
            api
              .addCategory({
                cat_pid: cat_pid.value,
                cat_name: category.value.cat_name,
                cat_level: cat_level.value
              })
              .then((res: any) => {
                if (res.meta.status === 201) {
                  ElMessage.success(res.meta.msg);
                  show.value = false;
                  getCategories();
                  child.value.getClassify();
                  child.value.value = ref<string[]>([]);
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
        }
      });
    };
    //点击编辑商品分类
    const edit = (row: obj) => {
      category.value = row;
      show.value = true;
      title.value = "编辑分类";
    };
    //删除商品分类
    const del = (id: number) => {
      ElMessageBox.confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .delCategory({
              id: id
            })
            .then((res: any) => {
              if (res.meta.status === 200) {
                ElMessage({
                  type: "success",
                  message: res.meta.msg
                });
                getCategories();
              }
              // console.log(res);
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
      getCategories();
    };
    //切换每页显示条数
    const handleSizeChange = (val: number) => {
      pagesize.value = val;
      getCategories();
    };
    // 声明方法结束
    // 页面加载
    onMounted(() => {
      getCategories();
    });
    //监听
    watch(
      () => category.value.cat_name,
      val => {
        val ? (disabled.value = false) : (disabled.value = true);
      }
    );
    return {
      tableData,
      add,
      title,
      ruleForm,
      category,
      rules,
      submit,
      show,
      edit,
      del,
      pagesize,
      pagenum,
      handleSizeChange,
      handleCurrentChange,
      total,
      change,
      disabled,
      child
    };
  }
});
</script>

<style scoped>
.ipt-d {
  width: 300px;
}
</style>