<template>
  <div class="login-b p-f f-j-c">
    <el-card class="box-card">
      <!-- 标题 -->
      <template #header>
        <div class="card-header">
          <div class="t-a-c f-s25 f-w-b">欢迎来到小爱后台管理系统</div>
        </div>
      </template>
      <!-- 内容 -->
      <div>
        <el-form
          :model="user"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
        >
          <el-form-item label="请输入用户名" prop="userName">
            <el-input v-model="user.userName" class="ipt"></el-input>
          </el-form-item>
          <el-form-item label="请输入密码" prop="password">
            <el-input
              v-model="user.password"
              type="password"
              class="ipt"
            ></el-input>
          </el-form-item>
          <div class="t-a-c">
            特别提醒:
            如果您是管理员,请使用管理员账号登录,如果不知道账号,请联系公司人事。
          </div>
          <div class="m-t10 t-a-c">
            <el-button type="primary" @click="submitLogin">立即登录</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import api from "@/http/api";
import { createLogger } from "vuex";
import { ElMessage } from "element-plus";
import {useRoute, useRouter} from 'vue-router'

//用户接口
interface user {
  userName: string;
  password: string;
}

export default defineComponent({
  setup() {
    //变量开始
    let ruleForm = ref<any>(null);
    //用户信息
    let user = ref<user>({
      userName: "",
      password: ""
    });
    //验证
    const rules = ref<any>({
      userName: [
        { required: true, message: "请输入用户名称", trigger: "blur" },
        { min: 5, max: 18, message: "长度在 5 到 18 个字符", trigger: "blur" }
      ],
      password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
      ]
    });
    let router = useRouter()
    //变量结束

    //方法开始

    //立即登录
    const submitLogin = () => {
      ruleForm.value!.validate((valid: boolean) => {
        if (valid) {
          api
            .login({
              username: user.value.userName,
              password: user.value.password
            })
            .then((res:any) => {
              // console.log(data);
              if (res.meta.status === 200) {
                //存储token和用户信息
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data));
                //提示
                ElMessage.success(res.meta.msg);
                //跳转到首页
                router.push('/')
              } else ElMessage.error(res.meta.msg);
            })
            .catch((err:any) => {
              console.log(err);
            });
        }
      });
    };

    //方法结束
    return {
      user,
      rules,
      submitLogin,
      ruleForm
    };
  }
});
</script>

<style scoped lang="scss">
.login-b {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .box-card {
    width: 650px;
    .ipt {
      width: 400px;
    }
  }
}
</style>