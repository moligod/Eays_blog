<template>
    <div class="container">
        <div class="nav">
            <div @click="homePage">首页</div>
            <div>
                <!-- 弹出选择 -->
                <n-popselect @update:value="searchByCatgory" v-model:value="selectedCategory" :options="CategortyOptions" trigger="click">
                    <div>分类<span>{{ categoryName }}</span></div>
                </n-popselect>
            </div>
            <div @click="dashboard">后台</div>
        </div>
        <!-- 内容 -->
        <n-divider />
        <!-- 搜索框 -->
        <n-space class="search">
            <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="请输入关键字" />
            <n-button @click="loadBlos"> 搜索 </n-button>
        </n-space>
        <!-- 主题内容 -->
        <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px;cursor:pointer;">
            <n-card :title="blog.title" @click="toDetail(blog)">
                {{ blog.content }}
                <template #footer>
                    <n-space align="center">
                        <div>发布时间：{{ blog.create_time }}</div>
                    </n-space>
                </template>
            </n-card>
        </div>
        <n-space vertical>
            <n-pagination @click="loadBlos()" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount"
                show-quick-jumper>
                <template #goto>
                    页码
                </template>
            </n-pagination>
        </n-space>

        <!-- 页脚 -->
        <n-divider />
        <div class="footer">
            <div>Power by XXXX</div>
            <div>XICP备XXXXX号-1</div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 路由
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
//选择的分类
const selectedCategory = ref(0)
//所有分类
const CategortyOptions = ref([])
onMounted(() => {
    loadBlos();
    loadCategorys();
})
const categoryName = computed(() => {
    let category = CategortyOptions.value.find((item) => item.value == selectedCategory.value)
    //如果找到了就返回label，否则返回空字符串
    return category ? category.label : ""
})
const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    CategortyOptions.value = res.data.rows.map((item) => {
        return { label: item.name, value: item.id }
    })
}
//分页查询，keyword是关键字
const pageInfo = reactive({ page: 1, pageSize: 3, pageCount: 0, count: 0, keyword: "",categoryid:0 })
const blogListInfo = ref([])
//获取博客文章
const loadBlos = async () => {

    await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryid=${pageInfo.categoryid}`).then(res => {
        if (res.data.code == 200) {
            let temp_rows = res.data.data.rows
            for (let row of temp_rows) {
                let d = new Date(row.create_time)
                row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
                row.content += "..."
            }
            blogListInfo.value = temp_rows
            //总页数
            pageInfo.count = res.data.data.count
            //计算总页数,math.ceil向上取整
            pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize)
        } else {
            message.error(res.data.msg)
        }
    })
}



const homePage = () => {
    router.push("/")
    pageInfo.categoryid = 0;
    loadBlos();
}

const dashboard = () => {
    router.push("/login")
}
const toDetail = (blog) => {
    router.push({ path: "/detail", query: { id: blog.id } })
}
const searchByCatgory = (value) => {
    console.log(value)
    pageInfo.categoryid = value
    loadBlos()
    
}
</script>

<style lang="scss" scoped>
.search {
    margin-bottom: 15px;
}

.container {
    width: 1200px;
    margin: 0 auto;
}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;

    div {
        cursor: pointer;
        margin-right: 15px;

        &:hover {
            color: #f60;
        }

        span {
            font-size: 12px;
        }
    }
}

.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a;
}
</style>