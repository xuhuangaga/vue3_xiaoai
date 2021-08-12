<template>
  <div style="width:200px">
    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          :default-active="route.meta.index"
          class="el-menu-vertical-demo h-vh"
          router
          :unique-opened="true"
        >
          <el-menu-item index="/" @click="saveTags('/','首页')">
            <i class="el-icon-s-home"></i>
            <template #title>首页</template>
          </el-menu-item>
          <el-submenu
            v-for="(item, index) in menus"
            :key="item.id"
            :index="index + 1 + ''"
          >
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/'+item1.path"
              v-for="(item1, index1) in item.children"
              :key="item1.id"
               @click="saveTags('/'+item1.path,item1.authName)"
            >
              <i :class="item1.icon"></i>
              <span>{{ item1.authName }}</span></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Vue from "vue";
import api from "@/http/api";
import { useRoute, useRouter } from "vue-router";
import store from '@/store/index'
import { isEqual, uniqWith } from 'lodash'

export default defineComponent({
  setup() {
    interface obj {
      authName: string;
      id: number;
      order: number;
      path: string;
      children: [];
      icon: string;
    }
    //声明变量开始
    let menus = ref<obj[]>([]);
    let route = useRoute();
    //图标数组
    let icon = [
      {
        iconO: "el-icon-user",
        iconT: ["el-icon-folder-opened"]
      },
      {
        iconO: "el-icon-folder",
        iconT: ["el-icon-setting", "el-icon-c-scale-to-original"]
      },
      {
        iconO: "el-icon-goods",
        iconT: ["el-icon-help", "el-icon-bell", "el-icon-date"]
      },
      {
        iconO: "el-icon-s-order",
        iconT: ["el-icon-folder-add"]
      },
      {
        iconO: "el-icon-message",
        iconT: ["el-icon-position"]
      }
    ];
    // 声明变量结束
    //方法开始
    //保存标签
    const saveTags=(url:string,name:string)=>{
      if (route.name !== 'Erro') {
        let tags = []
        //存储标签
        let t = localStorage.getItem('tags')
        if (t) {
          tags = JSON.parse(t)
        }
        tags.push({
          name: name,
          path: url
        })
        //去重
        tags = uniqWith(tags, isEqual)

        localStorage.setItem('tags', JSON.stringify(tags))
        store.commit('setTags', tags)
      }
    }
    //获取左侧菜单栏
    const getMenus = () => {
      //获取本地目录
      let m = JSON.parse(localStorage.getItem("menu")!);
      if (m) {
        menus.value = m;
        // console.log(m);
      } else {
        api
          .menus()
          .then((res:any) => {
            if (res.meta.status === 200) {
              menus.value = res.data;
              res.data.map((item: obj, index: number) => {
                item.icon = icon[index].iconO;
                item.children.map((item1: obj, index1) => {
                  item1.icon = icon[index].iconT[index1];
                });
              });
              //将左侧目录存本地
              localStorage.setItem("menu", JSON.stringify(res.data));
            }
            // console.log(res);
          })
          .catch((err:any) => {});
      }
      // console.log(menus.value);
    };
    //页面加载
    onMounted(() => {
      getMenus();
    });
    // 方法结束
    return {
      menus,
      route,
      saveTags
    };
  }
});
</script>

<style scoped>
</style>