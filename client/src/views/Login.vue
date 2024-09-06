<template>
    <div class="login-panel">
        <n-card title="管理后台登录">
            <!-- nav-ui组件，n-form 表单组件，n-form-item 表单项组件，n-input 输入框组件，n-checkbox 复选框组件，n-button 按钮组件!-->
             <!-- 将表单的数据模型绑定到 admin 对象，这样表单中的输入框会与 admin 对象的属性同步 -->
             <!-- 将表单的验证规则绑定到 rules 对象，这样表单组件会根据这些规则进行数据验证。 -->
            <n-form :rules="rules" :model="admin">
                <!-- path 属性指定了数据路径，label 属性设置了标签。 -->
                <n-form-item path="account" label="账号">
                    <!-- v-model:value 指令创建了输入框和 admin.account 属性之间的双向数据绑定。placeholder 属性提供了输入框的占位文本。 -->
                    <n-input v-model:value="admin.account" placeholder="请输入账号" />
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <!-- 同样，v-model:value 创建了双向数据绑定，placeholder 提供了占位文本。 -->
                    <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
                </n-form-item>
            </n-form>
            <!-- footer 插槽，用于自定义底部内容 -->
            <template #footer>
                <!-- v-model:checked 指令创建了复选框和 admin.rember 属性之间的双向数据绑定 -->
                <n-checkbox v-model:checked="admin.rember" label="记住我" />
                <n-button @click="login">登录</n-button>
            </template>
        </n-card>
    </div>
</template>

<script setup>
//ref 用于创建一个响应式的引用对象，reactive 用于创建一个响应式的对象，inject 用于依赖注入。
import { ref, reactive, inject } from 'vue'
//状态管理对象
import { AdminStore } from '../stores/AdminStore.js'
//useRouter 用于获取路由器实例，useRoute 用于获取当前路由对象，跳转后台界面用的路由
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
//message 用于消息弹窗提示navui的（需要app.vue包起来），axios 用于发送网络请求
const message = inject("message")
const axios = inject("axios")
//状态管理对象
const adminStore = AdminStore()

/**验证表单规则 */
let rules = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
    ],
};

/**管理员登录数据，判断是否上次存入本地 */
const admin = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    rember: localStorage.getItem("rember") == 1 || false
})

/**登录,[]内是需要传入的值 */
const login = async () => {
    let result = await axios.post("/admin/login", {
        account: admin.account,
        password: admin.password
    });
    if (result.data.code == 200) {
        adminStore.token = result.data.data.token
        adminStore.account = result.data.data.account
        adminStore.id = result.data.data.id

        //把数据存储到localStorage(如果点击记住我)
        if (admin.rember) {
            localStorage.setItem("account", admin.account)
            localStorage.setItem("password", admin.password)
            localStorage.setItem("rember", admin.rember ? 1 : 0)
        }
        //跳转到dashboard路由地址
        router.push("/dashboard")
        message.info("登录成功")
    } else {
        message.error("登录失败")
    }

}

</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin: 0 auto;
    margin-top: 130px;
}
</style>