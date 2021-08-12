<template>
  <div class="b-b f-a-c f-w tag-b">
    <div
      ref="box"
      v-for="(item, index) in list"
      :key="index"
      @click="click(item.path)"
      class="item m-r10 m-b10 f-s12 f-a-c c-p b-e"
      :class="{ active: route.path === item.path }"
      @contextmenu.prevent="showBox(item.path, $event)"
    >
      <div class="yd bc-w" v-show="route.path === item.path"></div>
      <div class="m-lr5">{{ item.name }}</div>
      <div
        v-show="
          (route.path === item.path && route.path !== '/') ||
            (list.length > 1 && item.path === '/' && route.path === item.path)
        "
      >
        <i class="el-icon-close" @click.stop="close(index)"></i>
      </div>
    </div>
  </div>
  <!-- 右键弹出框 -->
  <div
    class="br-5 bc-w spring b-e f-s12 c-p z"
    v-show="show"
    :style="{ left: tranLeft, top: tranTop }"
  >
    <div class="t-a-c" @click="delOther">关闭其他</div>
    <div class="t-a-c" @click="del(true)">关闭左侧</div>
    <div class="t-a-c" @click="del(false)">关闭右侧</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, warn } from "vue";
import store from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useClickOutside } from "@/hooks/useCliskOutside";

export default defineComponent({
  setup() {
    interface obj {
      name: string;
      path: string;
    }
    //声明变量开始
    let box = ref<HTMLElement | null>(null);
    let { isClickOutside } = useClickOutside(box);
    // 向左偏移
    let tranLeft = ref<string>("");
    // 向右偏移
    let tranTop = ref<string>("");
    //右键弹框是否显示
    let show = ref<boolean>(false);
    let route = useRoute();
    let routePath = ref<string>(route.path).value;
    let router = useRouter();
    //标签数组
    let list = computed(() => {
      return store.state.tags;
    });
    //右键选中的标签路径
    let currPath = ref<string>("");

    //声明变量结束
    //方法开始
    //右键点击事件
    const showBox = (path: string, e: any) => {
      show.value = true;
      tranLeft.value = e.pageX + "px";
      tranTop.value = e.pageY + "px";
      currPath.value = path;
    };
    const clickTag = () => {
      //
    };
    //关闭其他
    const delOther = () => {
      //获取本地标签
      let t = JSON.parse(localStorage.getItem("tags")!);
      let news = t.filter((item: obj) => {
        return item.path === currPath.value;
      });
      localStorage.setItem("tags", JSON.stringify(news));
      store.commit("setTags", news);
      router.push(news[0].path);
      if (t.length === news.length) ElMessage.error("已经是最后一个啦");
      show.value = false;
    };
    //关闭左边或者右边
    const del = (isLeft: boolean, idx: number) => {
      //获取本地标签
      let t = JSON.parse(localStorage.getItem("tags")!);
      let l_index = ref<number>(0);
      t.map((item: obj, index: number) => {
        if (item.path === currPath.value) l_index.value = index;
      });
      //删除左边或者右边的标签
      let news = t.filter((item: obj, index: number) => {
        if (isLeft) return index >= l_index.value;
        else return index <= l_index.value;
      });
      //提示
      if (isLeft && t.length === news.length) ElMessage.error("已经是第一个啦");
      if (!isLeft && t.length === news.length)
        ElMessage.error("已经是最后一个啦");
      localStorage.setItem("tags", JSON.stringify(news));
      store.commit("setTags", news);
      if (news.length === 1) router.push(news[0].path);
      else isLeft ? "" : router.push(currPath.value);
      show.value = false;
    };
    //点击标签
    const click = (path: string) => {
      router.push(path);
    };
    //点击关闭
    const close = (i: number) => {
      //获取本地标签
      let news = JSON.parse(localStorage.getItem("tags")!);
      news.splice(i, 1);
      if (news.length === 0) {
        news.push({
          name: "首页",
          path: "/"
        });
        router.push("/");
      } else {
        i === 0 ? router.push(news[i].path) : router.push(news[i - 1].path);
      }
      localStorage.setItem("tags", JSON.stringify(news));
      store.commit("setTags", news);
    };
    //监听isClickOutside
    watch(
      () => isClickOutside.value,
      val => {
        show.value = val;
      }
    );
    //监听show
    watch(
      () => show.value,
      val => {
        isClickOutside.value = val;
      }
    );
    //方法结束
    return {
      list,
      click,
      close,
      show,
      showBox,
      tranLeft,
      tranTop,
      delOther,
      del,
      currPath,
      route,
      box
    };
  }
});
</script>

<style scoped lang="scss">
.tag-b {
  .active {
    background: #409eff;
    color: #fff !important;
  }
  .item {
    padding: 2px 5px;
    .yd {
      width: 6px;
      height: 6px;
    }
  }
}
.spring {
  position: absolute;
  width: 70px;
  box-shadow: 1px 1px 1px #ccc;
  div {
    padding: 6px 0px;
  }
}
</style>