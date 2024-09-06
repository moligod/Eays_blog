import {createRouter, createWebHistory} from 'vue-router';
// createWebHistory();HTML5 history模式, 需要服务器配置来处理所有路由请求，以便正确地返回 index.html 文件

let routes=[
    { path: "/", component: () => import("../views/Login.vue") },
    { path: "/test", component: () => import("../views/Test.vue") },
    { path: "/login", component: () => import("../views/Login.vue") },
    { path: "/dashboard", component: () => import("../views/dashboard/dashboard.vue"),children:[
        { path: "/dashboard/category", component: () => import("../views/dashboard/Category.vue") },
        { path: "/dashboard/article", component: () => import("../views/dashboard/Article.vue") },
    ]},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export {router,routes};