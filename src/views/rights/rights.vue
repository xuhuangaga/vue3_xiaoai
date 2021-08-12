<template>
  <el-card class="wbfb">
    <el-table
      :data="tableData"
      style="width: 100%"
      :stripe="true"
      border
      class="m-t20"
    >
      <el-table-column label="#" width="50" type="index" align="center">
      </el-table-column>
      <el-table-column label="权限名称" prop="authName" align="center">
      </el-table-column>
      <el-table-column label="权限等级" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level==='1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import api from "@/http/api";

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
    //权限数据
    let tableData = ref<obj[]>([]);
    // 声明变量结束
    // 声明方法开始
    //获取所有权限
    const getPermissions = () => {
      api
        .getPermissions({
          type: "list"
        })
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
    // 声明方法结束
    //页面加载
    onMounted(() => {
      getPermissions();
    });
    return {
      getPermissions,
      tableData
    };
  }
});
</script>

<style scoped>
</style>