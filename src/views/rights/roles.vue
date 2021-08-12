<template>
  <el-card class="wbfb">
    <el-button type="primary" @click="add">添加角色</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="true"
      border
      class="m-t20"
    >
      <el-table-column type="expand">
        <template #default="props">
          <div v-if="props.row.children.length === 0">暂无权限</div>
          <div v-else>
            <div
              class="f-a-c p-tb10"
              v-for="(item, index) in props.row.children"
              :key="item.id"
              :id="`tag-${item.authName}`"
              :class="{ 'b-b': index !== props.row.children.length - 1 }"
            >
              <div class="f-a-c f-1">
                <el-tag
                  closable
                  class="m-r20"
                  @close="handleClose(props.row, item)"
                >
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </div>
              <div class="f-4">
                <div
                  v-for="(item1, index1) in item.children"
                  :key="item1.id"
                  class="f-a-c p-tb10"
                  :class="{ 'b-b': index1 !== item.children.length - 1 }"
                  :id="`tag-${item1.authName}`"
                >
                  <div v-if="item1.children.length > 0" class="f-a-c m-r20">
                    <el-tag
                      closable
                      type="success"
                      class="m-r20"
                      @close="handleClose(props.row, item1)"
                    >
                      {{ item1.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </div>
                  <div class="f-a-c f-w" style="margin-left:30px">
                    <div
                      v-for="(item2, index2) in item1.children"
                      :key="item2.id"
                      :id="`tag-${item2.authName}`"
                    >
                      <el-tag
                        closable
                        type="warning"
                        class="m-r10 m-t-b5"
                        @close="handleClose(props.row, item2)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="#" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column label="职位" prop="roleName" align="center">
      </el-table-column>
      <el-table-column label="描述" prop="roleDesc" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" @click="del(scope.row)"
            >删除</el-button
          >
          <el-button
            type="warning"
            size="mini"
            @click="assign(scope.row, scope.index)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog :title="title" v-model="dialogVisible" width="30%">
    <el-form :model="role" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model.trim="role.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="role.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="分配权限" v-model="distribution" width="30%" @close="close">
    <el-tree
      :data="list"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps"
      :default-checked-keys="ids"
    >
    </el-tree>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="distribution = false">取 消</el-button>
        <el-button type="primary" @click="subAss">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { uniq } from "lodash";
//角色接口
interface role {
  roleName: string;
  roleDesc: string;
  id: number;
  children: [];
  index: number;
}
//权限接口
interface obj {
  authName: string;
  children: [];
  id: number;
  path: string;
  pid: 0;
}
export default defineComponent({
  setup() {
    // 声明变量开始
    let title = ref<string>("");
    let tags = ref<any>(null);
    //权限选中的id数组
    let ids = ref<number[]>([]);
    let tree = ref<any>(null);
    let defaultProps = {
      children: "children",
      label: "authName",
      value: "id"
    };
    //添加/编辑角色弹框是否显示
    let dialogVisible = ref<boolean>(false);
    //分配权限弹框是否显示
    let distribution = ref<boolean>(false);
    let tableData = ref<role[]>([]);
    let list = ref<obj[]>([]);
    let role = ref<role>({
      roleName: "",
      roleDesc: "",
      id: 0,
      children: [],
      index: 0
    });
    let ruleForm = ref<any>(null);
    //待分配角色的id
    let roleId = ref<number>(0);
    //待分配角色的下标
    let roleIndex = ref<number>(0);
    //验证
    const rules = ref<any>({
      roleName: [
        { required: true, message: "请输入角色名", trigger: "blur" },
        { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
      ]
    });
    // 声明变量结束
    let expandRowKeys = ref<number[]>([]);
    // 声明方法开始
    //添加/编辑角色
    const submit = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          if (role.value.id) {
            //编辑角色
            api
              .editRolesById({
                id: role.value.id,
                roleName: role.value.roleName,
                roleDesc: role.value.roleDesc
              })
              .then((res: any) => {
                // console.log(res);
                if (res.meta.status === 200) {
                  ElMessage.success("更新成功");
                  dialogVisible.value = false;
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          } else {
            //添加角色
            api
              .addRoles({
                roleName: role.value.roleName,
                roleDesc: role.value.roleDesc
              })
              .then((res: any) => {
                if (res.meta.status === 201) {
                  ElMessage.success(res.meta.msg);
                  dialogVisible.value = false;
                  getRoles();
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
        }
      });
    };
    //获取角色列表
    const getRoles = () => {
      api
        .getRolesList()
        .then((res: any) => {
          // console.log(res);
          if (res.meta.status === 200) {
            tableData.value = res.data;
            tableData.value.map((item, index) => {
              item.index = index;
            });
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //编辑
    const edit = (row: role) => {
      role.value = row;
      dialogVisible.value = true;
      title.value = "编辑角色";
    };
    //点击添加角色
    const add = () => {
      role.value.roleName = "";
      role.value.roleDesc = "";
      role.value.id = 0;
      dialogVisible.value = true;
      title.value = "添加角色";
    };
    //删除角色
    const del = (role: role) => {
      ElMessageBox.confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .delRolesById({
              id: role.id
            })
            .then((res: any) => {
              if (res.meta.status === 200) {
                ElMessage({
                  type: "success",
                  message: res.meta.msg
                });
                getRoles();
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
    //分配权限
    const assign = (role: role, index: number) => {
      roleId.value = role.id;
      roleIndex.value = index;
      distribution.value = true;
      role.children.map((item: obj) => {
        item.children.map((item1: obj) => {
          item1.children.map((item2: obj) => {
            ids.value.push(item2.id);
          });
        });
      });
      // console.log(ids.value);
      tree.value && tree.value.setCheckedKeys(ids.value);
    };
    //获取所有权限
    const getPermissions = () => {
      api
        .getPermissions({
          type: "tree"
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
    };
    //关闭分配权限弹框
    const close = () => {
      //关闭弹窗
      distribution.value = false;
      //清空选中的id
      tree.value.setCheckedKeys([]);
      ids.value = [];
    };
    //确定分配权限
    const subAss = () => {
      //选中的节点
      let checked = tree.value.getCheckedKeys();
      //选中半选中的节点
      checked = checked.concat(tree.value.getHalfCheckedKeys());
      api
        .rolesAuthorization({
          roleId: roleId.value,
          rids: checked.join()
        })
        .then((res: any) => {
          if (res.meta.status === 200) {
            ElMessage({
              type: "success",
              message: res.meta.msg
            });
            getRoles();
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
      distribution.value = false;
    };

    //删除指定权限
    const handleClose = (row: obj, role: obj) => {
      ElMessageBox.confirm("此操作将永久取消该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .delPermissions({
              roleId: row.id,
              rightId: role.id
            })
            .then((res: any) => {
              if (res.meta.status === 200) {
                ElMessage({
                  type: "success",
                  message: res.meta.msg
                });
                getRoles();
              }
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
    // 声明方法结束
    //页面加载
    onMounted(() => {
      getRoles();
      getPermissions();
    });
    return {
      tableData,
      dialogVisible,
      submit,
      role,
      rules,
      ruleForm,
      getRoles,
      edit,
      add,
      del,
      distribution,
      assign,
      getPermissions,
      list,
      defaultProps,
      ids,
      close,
      subAss,
      tree,
      handleClose,
      title,
      tags,
      expandRowKeys
    };
  }
});
</script>

<style scoped lang="scss">
</style>