import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Layout from '../views/layout/layout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: "/",
        name: "home",
        component: Home,
        meta: {
          title: '首页',
          index: '/'
        }
      }, {
        path: "/users",
        name: "users",
        component: () => import('../views/users/users.vue'),
        meta: {
          title: '用户列表',
          index: '/users'
        }
      }
      , {
        path: "/rights",
        name: "rights",
        component: () => import('../views/rights/rights.vue'),
        meta: {
          title: '权限列表',
          index: '/rights'
        }
      }
      , {
        path: "/roles",
        name: "roles",
        component: () => import('../views/rights/roles.vue'),
        meta: {
          title: '角色列表',
          index: '/roles'
        }
      }, {
        path: "/goods",
        name: "goods",
        component: () => import('../views/goods/goods.vue'),
        meta: {
          title: '商品列表',
          index: '/goods'
        }
      }, {
        path: "/params",
        name: "params",
        component: () => import('../views/goods/params.vue'),
        meta: {
          title: '分类参数',
          index: '/params'
        }
      }, {
        path: "/categories",
        name: "categories",
        component: () => import('../views/goods/categories.vue'),
        meta: {
          title: '商品分类',
          index: '/categories'
        }
      }, {
        path: "/addgoods",
        name: "addgoods",
        component: () => import('../views/goods/addgoods.vue'),
        meta: {
          title: '添加商品',
          index: '/goods'
        }
      },{
        path: "/orders",
        name: "orders",
        component: () => import('../views/orders/orders.vue'),
        meta: {
          title: '订单列表',
          index: '/orders'
        }
      }, {
        path: "/reports",
        name: "reports",
        component: () => import('../views/reports/reports.vue'),
        meta: {
          title: '数据统计',
          index: '/reports'
        }
      },
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'Erro',
    component: () => import('../views/erro/Erro.vue'),
    meta: {
      title: '404'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  //如果没有登录 跳转到登录
  if (to.name === "login") {
    next()
  } else {
    localStorage.getItem('user')! ? next() : next('/login')
  }
})
export default router;
