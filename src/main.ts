import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
// import ZkTable from "vue-table-with-tree-grid"


const app = createApp(App)
// 将自动设置 Day.js 的国际化设置为 'zh-cn'
app.use(ElementPlus, { locale })
// app.use(ZkTable)
app.use(store).use(router).mount("#app");
