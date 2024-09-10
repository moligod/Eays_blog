import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
//独立api
import { createDiscreteApi } from 'naive-ui'
import {router} from './common/router'
import {createPinia} from 'pinia'
import axios from 'axios'

import { AdminStore } from './stores/AdminStore'

//服务端默认地址
axios.defaults.baseURL = 'http://localhost:8080'
//独立api
const {message,notification,dialog} = createDiscreteApi(["message", "dialog", "notification"])
//创建一个新的 Vue 应用程序实例，并将 App 组件作为根组件。


const app = createApp(App)

app.provide('axios', axios)
app.provide('message', message)
app.provide('notification', notification)
app.provide('dialog', dialog)

app.provide("server_url", axios.defaults.baseURL )

app.use(naive)
app.use(createPinia());
app.use(router);
const adminStore = AdminStore()
//拦截器，每次请求都会优先执行这个拦截器
axios.interceptors.request.use((config)=>{
    config.headers.token = adminStore.token
    return config
})
//将 Vue 应用程序挂载到 DOM 中的 #app 元素上。这意味着 Vue 会接管这个元素，并在其内部渲染 App 组件
app.mount('#app')