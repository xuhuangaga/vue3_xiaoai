<template>
  <el-alert
    title="
    注意:只允许为第三级分类设置相关参数!"
    type="warning"
    show-icon
    :closable="false"
  >
  </el-alert>
  <div class="f-a-c m-t20 m-b10">
    <div class="f-s20 m-r10">选择商品分类</div>
    <classify type="0" @change="change"></classify>
  </div>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="first"></el-tab-pane>
    <el-tab-pane label="静态参数" name="second"></el-tab-pane>
  </el-tabs>
  <div>
    <el-button size="mini" type="primary" :disabled="!categoryId" @click="edit">
      {{ title }}
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="true"
      border
      class="m-t20"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div class="f-a-c f-w">
            <template v-if="props.row.attr_vals">
              <template
                v-for="(item, index) in props.row.attr_vals.split(',')"
                :key="index"
              >
                <el-tag
                  v-if="item"
                  class="m-b10"
                  closable
                  @close="close(props.row, item)"
                  >{{ item }}</el-tag
                >
              </template>
            </template>
            <span :id="`${props.row.attr_id}-input`" class="input-new-tag">
              <el-input
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                :autofocus="true"
                @keyup.enter="handleInputEnter(props.row)"
                @blur="handleInputConfirm(props.row)"
              >
              </el-input>
            </span>
            <div class="m-b10">
              <el-button
                :id="`${props.row.attr_id}-button`"
                class="button-new-tag"
                size="small"
                @click="showInput(props.$index, props.row)"
                >+ New Tag</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="#" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column label="参数名称" prop="attr_name" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="del(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog
    :title="title === '添加参数' ? '添加动态参数' : '添加静态属性'"
    v-model="show"
    width="30%"
  >
    <el-form :model="attr" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item
        :label="title === '添加参数' ? '动态参数' : '静态属性'"
        prop="attr_name"
      >
        <el-input v-model.trim="arrName"></el-input>
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
import { defineComponent, ref } from "vue";
import classify from "@/components/goods/classify/classify.vue";
import api from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";

interface obj {
  attr_id: number;
  attr_name: string;
  attr_sel: string;
  attr_vals: string;
  attr_write: string;
  cat_id: number;
  delete_time: number | null;
  inputValue: string;
}
export default defineComponent({
  components: {
    classify
  },
  setup() {
    // 声明变量开始
    let arrName = ref<string>("");
    let inputValue=ref<string>('')
    let attr = ref<obj>({
      attr_id: 0,
      attr_name: "",
      attr_sel: "",
      attr_vals: "",
      attr_write: "",
      cat_id: 0,
      delete_time: null,
      inputValue: ''
    });
    //弹框是否显示
    let show = ref<boolean>(false);
    let tableData = ref<obj[]>([]);
    //分类id
    let categoryId = ref<number>(0);
    let activeName = ref<string>("first");
    let title = ref<string>("添加参数");
    //动态或静态
    let sel = ref<string>("many");
    let saveTagInput = ref();
    //验证
    const rules = ref<any>({
      arrName: [
        { required: true, message: "请输入参数名", trigger: "blur" },
        { min: 2, max: 10, message: "参数名在2-10位之间", trigger: "blur" }
      ]
    });
    let ruleForm = ref<any>(null);
    // 声明变量结束
    // 声明方法开始
    //点击添加/编辑参数
    const edit = (item: obj) => {
      attr.value = item;
      arrName.value = item.attr_name;
      show.value = true;
    };
    //添加动态参数或者静态属性
    const submit = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          if (attr.value.attr_id) {
            //编辑参数
            api
              .editAttributes({
                id: attr.value.cat_id,
                attrId: attr.value.attr_id,
                attr_name: arrName.value,
                attr_sel: attr.value.attr_sel,
                attr_vals: ""
              })
              .then((res: any) => {
                // console.log(res);
                if (res.meta.status === 200) {
                  ElMessage.success("更新成功");
                  show.value = false;
                  getAttributes();
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          } else {
            //添加参数
            api
              .addAttributes({
                id: categoryId.value,
                attr_name: arrName.value,
                attr_sel: sel.value,
                attr_vals: ""
              })
              .then((res: any) => {
                if (res.meta.status === 201) {
                  ElMessage.success(res.meta.msg);
                  show.value = false;
                  getAttributes();
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
        }
      });
    };
    //选择父级分类
    const change = (val: any) => {
      categoryId.value = val[val.length - 1];
      getAttributes();
    };
    //添加标签 回车事件
    const handleInputEnter = (item: obj) => {
      saveTagInput.value.blur();
    };
    //点击tabs标签
    const handleClick = (tab: any) => {
      activeName.value = tab.props.name;
      if (tab.props.name === "first") {
        title.value = "添加参数";
        sel.value = "many";
      } else {
        title.value = "添加属性";
        sel.value = "only";
      }
      getAttributes();
    };
    //获取参数列表
    const getAttributes = () => {
      api
        .getAttributes({ id: categoryId.value, sel: sel.value })
        .then((res: any) => {
          // console.log(res);
          if (res.meta.status === 200) {
            tableData.value = res.data;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //新增标签
    const showInput = (index: number, row: any) => {
      let btn: any = document.getElementById(`${row.attr_id}-button`);
      let ipt: any = document.getElementById(`${row.attr_id}-input`);
      btn.style.display = "none";
      ipt.style.display = "block";
      saveTagInput.value.focus();
    };
    //删除角色
    const del = (item: obj) => {
      // console.log(item);
      ElMessageBox.confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .delAttributes({
              id: item.cat_id,
              attrid: item.attr_id
            })
            .then((res: any) => {
              if (res.meta.status === 200) {
                ElMessage({
                  type: "success",
                  message: res.meta.msg
                });
                getAttributes();
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
    //删除标签
    const close = (item: obj, name: string) => {
      let attrVal = item.attr_vals ? item.attr_vals + "," : "";
      if (item.attr_vals) {
        //删除标签
        let valArr = item.attr_vals.split(",").filter(i => {
          return i !== name;
        });
        attrVal = valArr.join();
        item.attr_vals=attrVal
      }
      api
        .updateAttributesById({
          id: item.cat_id,
          attrId: item.attr_id,
          attr_name: item.attr_name,
          attr_sel: item.attr_sel,
          attr_vals: attrVal
        })
        .then((res: any) => {
          if (res.meta.status === 200) {
            ElMessage.success(res.meta.msg);
            show.value = false;
            // getAttributes();
          } else ElMessage.error(res.meta.msg);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //添加新参数
    const handleInputConfirm = (item: obj) => {
      if (inputValue.value) {
        let attrVal = item.attr_vals ? item.attr_vals + "," : "";
        attrVal += inputValue.value;
        item.attr_vals = attrVal;
        // console.log(inputValue.value);
        api
          .updateAttributesById({
            id: item.cat_id,
            attrId: item.attr_id,
            attr_name: item.attr_name,
            attr_sel: item.attr_sel,
            attr_vals: attrVal
          })
          .then((res: any) => {
            if (res.meta.status === 200) {
              ElMessage.success(res.meta.msg);
              show.value = false;
              inputValue.value = "";
              // getAttributes();
            } else ElMessage.error(res.meta.msg);
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        ElMessage.error("添加内容不能为空");
      }
    };
    // 声明方法结束
    return {
      arrName,
      change,
      activeName,
      handleClick,
      title,
      tableData,
      del,
      categoryId,
      show,
      ruleForm,
      attr,
      rules,
      submit,
      showInput,
      handleInputConfirm,
      edit,
      handleInputEnter,
      close,
      saveTagInput,
      inputValue
    };
  }
});
</script>

<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 300px;
  margin-left: 10px;
  vertical-align: bottom;
  display: none;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>