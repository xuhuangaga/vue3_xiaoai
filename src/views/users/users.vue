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
      <el-button type="primary" @click="add">添加用户</el-button>
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
      <el-table-column label="姓名" prop="username" align="center">
      </el-table-column>
      <el-table-column label="角色" prop="role_name" align="center">
      </el-table-column>
      <el-table-column label="电话" prop="mobile" align="center">
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center">
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="change(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑用户"
            placement="top"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除用户"
            placement="top"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="del(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="distribution(scope.row)"
            ></el-button>
          </el-tooltip>
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
      :total="total">
    </el-pagination>
    </div>
  </el-card>
  <el-dialog :title="title" v-model="show" width="40%">
    <el-form :model="users" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="users.username" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!users.id">
        <el-input v-model.trim="users.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="users.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model.trim="users.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="分配角色" v-model="roleShow" width="50%">
    <div>当前用户:{{ users.username }}</div>
    <div class=" m-t-b20">当前角色:{{ users.role_name }}</div>
    <el-select v-model="checkRoleName" placeholder="请选择">
      <el-option
        v-for="item in roleList"
        :key="item.id"
        :label="item.roleName"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="roleShow = false">取 消</el-button>
        <el-button type="primary" @click="submitDis">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import api from "@/http/api";
import { ElMessage, ElMessageBox } from "element-plus";
//用户接口
interface obj {
  create_time: number;
  email: string;
  id: number;
  mg_state: boolean;
  mobile: string;
  role_name: string;
  username: string;
  password: string;
}
//角色接口
interface role {
  roleName: string;
  roleDesc: string;
  id: number;
  children: [];
}
export default defineComponent({
  setup() {
    // 声明变量开始
    //搜索内容
    let search = ref<string>("");
    //用户名输入框是否禁用
    let disabled = ref<boolean>(false);
    //选中的角色id
    let checkRoleName = ref<string>("");
    //验证邮箱
    const validateEmail = (rule: any, value: string, callback: any) => {
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
      ) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    //验证手机号码
    const validateMobile = (rule: any, value: string, callback: any) => {
      if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    let users = ref<obj>({
      create_time: 0,
      email: "",
      id: 0,
      mg_state: false,
      mobile: "",
      role_name: "",
      username: "",
      password: ""
    });
    //验证
    let rules = ref<any>({
      username: [
        { required: !disabled.value, message: "请输入用户名", trigger: "blur" },
        { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
      ],
      email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { validator: validateEmail, trigger: "blur" }
      ],
      mobile: [
        { required: true, message: "请输入手机号码", trigger: "blur" },
        { validator: validateMobile, trigger: "blur" }
      ]
    });
    let ruleForm = ref<any>(null);
    let title = ref<string>("");
    //添加/编辑用户弹框是否显示
    let show = ref<boolean>(false);
    //分配角色弹框是否显示
    let roleShow = ref<boolean>(false);
    //用户数据
    let tableData = ref<obj[]>([]);
    let roleList = ref<role[]>([]);
    //当前页码
    let pagenum=ref<number>(1)
    //每页显示条数
    let pagesize=ref<number>(5)
    //用户总条数
    let total=ref<number>(0)
    // 声明变量结束
    // 声明方法开始
    //点击添加用户
    const add = () => {
      disabled.value = false;
      title.value = "添加用户";
      show.value = true;
      users.value.email = "";
      users.value.id = 0;
      users.value.mobile = "";
      users.value.username = "";
    };
    //搜索
    const select=()=>{
      getUsers()
    }
    //获取用户数据
    const getUsers = () => {
      api
        .users({
          query: search.value,
          pagenum: pagenum.value,
          pagesize:pagesize.value
        })
        .then((res: any) => {
          // console.log(res);
          if (res.meta.status === 200) {
            tableData.value = res.data.users;
            total.value=res.data.total
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //确定添加/编辑用户
    const submit = () => {
      ruleForm.value.validate((valid: boolean) => {
        if (valid) {
          if (users.value.id) {
            //编辑用户
            api
              .EditUsers({
                id: users.value.id,
                email: users.value.email,
                mobile: users.value.mobile
              })
              .then((res: any) => {
                // console.log(res);
                if (res.meta.status === 200) {
                  ElMessage.success("更新成功");
                  show.value = false;
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          } else {
            //添加用户
            api
              .addUsers({
                username: users.value.username,
                password: users.value.password,
                email: users.value.email,
                mobile: users.value.mobile
              })
              .then((res: any) => {
                if (res.meta.status === 201) {
                  ElMessage.success(res.meta.msg);
                  show.value = false;
                  getUsers();
                } else ElMessage.error(res.meta.msg);
              })
              .catch((err: any) => {
                console.log(err);
              });
          }
        }
      });
    };
    //点击编辑用户
    const edit = (row: obj) => {
      users.value = row;
      show.value = true;
      title.value = "编辑用户";
      disabled.value = true;
    };
    //删除用户
    const del = (id: number) => {
      ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .delUserById({
              id: id
            })
            .then((res: any) => {
              if (res.meta.status === 200) {
                ElMessage({
                  type: "success",
                  message: res.meta.msg
                });
                getUsers();
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
    //点击分配角色
    const distribution = (row: obj) => {
      roleShow.value = true;
      users.value = row;
      checkRoleName.value=''
    };
    //确定分配角色
    const submitDis = () => {
      console.log(checkRoleName.value);
      if (users.value.username === "admin") {
        ElMessage.error("不允许修改admin账户");
      } else {
        api
          .setUserRole({
            id: users.value.id,
            rid: Number(checkRoleName.value)
          })
          .then((res: any) => {
            // console.log(res);
            if (res.meta.status === 200) {
              ElMessage.success("分配角色成功");
              roleShow.value = false;
              getUsers();
            } else ElMessage.error(res.meta.msg);
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    };
    //获取所有角色
    const getRoles = () => {
      api
        .getRolesList()
        .then((res: any) => {
          // console.log(res);
          if (res.meta.status === 200) {
            roleList.value = res.data;
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //修改用户状态
    const change = (row: obj, val: boolean) => {
      api
        .updateUserState({
          uId: row.id,
          type: val
        })
        .then((res: any) => {
          // console.log(res);
          if (res.meta.status === 200) {
            ElMessage.success("设置状态成功");
            show.value = false;
          } else ElMessage.error(res.meta.msg);
        })
        .catch((err: any) => {
          console.log(err);
        });
    };
    //切换页码
    const handleCurrentChange=(val:number)=>{
      pagenum.value=val
      getUsers()
    }
    //切换每页显示条数
    const handleSizeChange=(val:number)=>{
      pagesize.value=val
      getUsers()
    }
    // 声明方法结束
    // 页面加载
    onMounted(() => {
      getUsers();
      getRoles();
    });
    return {
      tableData,
      add,
      title,
      ruleForm,
      users,
      rules,
      submit,
      show,
      edit,
      del,
      distribution,
      submitDis,
      roleList,
      checkRoleName,
      roleShow,
      disabled,
      change,
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

<style scoped>
.ipt-d {
  width:300px;
}
</style>