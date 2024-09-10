<template>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
        <!-- 头部标签页1 -->
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px">
                <n-card :title="blog.title">
                    {{ blog.content }}
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="toDelete(blog.id)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>
            <!-- 手写分页 -->
            <!-- <n-space> -->
            <!-- <div @click="toPage(pageNum)" v-for= "pageNum in pageInfo.pageCount">
                <div :style="'color:'+(pageNum == pageInfo.page?'blue':'')">{{ pageNum }}</div>
                
            </div> -->
            <!-- </n-space> -->
            <!-- naui分页 -->
            <n-space vertical>
                <n-pagination @click="loadBlos(page)" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount"
                    show-quick-jumper>
                    <template #goto>
                        页码
                    </template>
                </n-pagination>
            </n-space>
        </n-tab-pane>
        <!-- 头部标签页2 -->
        <n-tab-pane name="add" tab="添加文章">
            <!-- 表格 -->
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输出标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryid" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <RichTextEditor v-model="addArticle.content"></RichTextEditor>
                </n-form-item>
                <n-form-item>
                    <n-button @click="add()">提交</n-button>
                </n-form-item>
            </n-form>
            <!-- 头部标签页3 -->
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输出标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryid" :options="categoryOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <RichTextEditor v-model="updateArticle.content"></RichTextEditor>
                </n-form-item>
                <n-form-item>
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
    {{ addArticle.concent }}
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import RichTextEditor from '../../components/RichTextEditor.vue'
//路由
const router = useRouter()
const route = useRoute()
//弹窗、对话框、异步请求
const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
//总览store数据-token等等
const adminStore = AdminStore()

const tabValue = ref("list")
//发送给后端前准备的数据
const addArticle = reactive({ categoryid: 0, title: "", content: "" })
const updateArticle = reactive({ id: 0, categoryid: 0, title: "", content: "" })
//分页查询
const pageInfo = reactive({ page: 1, pageSize: 3, pageCount: 0, count: 0 })

//获取分类列表
onMounted(() => {
    loadBlos()
    //获取分类列表
    localCategoryList()

})
const blogListInfo = ref([])
//获取博客文章
const loadBlos = async () => {
    await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`).then(res => {
        if (res.data.code == 200) {
            let temp_rows = res.data.data.rows
            for (let row of temp_rows) {
                // //create_time是时间戳，需要转换成日期
                // row.create_time = new Date(row.create_time).toLocaleString()
                //自定义日期
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
//分类列表
const categoryOptions = ref([])
const localCategoryList = async () => {
    await axios.get("/category/list").then(res => {
        if (res.data.code == 200) {
            //前端后端数据格式转换
            categoryOptions.value = res.data.rows.map((item) => {
                return { label: item.name, value: item.id }
            })
        } else {
            message.error(res.data.msg)
        }
    })
}
//手写分页的时候用的
// const toPage = async (pageNum) => {
//     pageInfo.page = pageNum
//     loadBlos()
// }
const add = () => {
    console.log(addArticle)
    axios.post("/blog/_token/add", addArticle).then(res => {
        if (res.data.code == 200) {
            message.success("添加成功")
            addArticle.title = ""
            addArticle.content = ""
            //刷新当前表格
            // localArticleList()
        } else {
            message.error(res.data.msg)
        }
    })
}
//提交修改
const update = async () => {

    await axios.put("/blog/_token/update", updateArticle).then(res => {
        if (res.data.code == 200) {
            message.success("添加成功")
            tabValue.value = "list"
            loadBlos()
            //刷新当前表格
            // localArticleList()
        } else {
            message.error(res.data.msg)
        }
    })
}
//修改界面用的数据
const toUpdate = async (blog) => {
    tabValue.value = "update"
    await axios.get("/blog/detail?id=" + blog.id).then(res => {
        if (res.data.code == 200) {
            console.log(res)
            updateArticle.id = blog.id
            updateArticle.title = res.data.rows[0].title
            updateArticle.content = res.data.rows[0].content
            updateArticle.categoryid = res.data.rows[0].category_id
        } else {
            message.error(res.data.msg)
        }
    })
}
const toDelete = async (id) => {
    dialog.warning({
        title: "警告",
        content: "你确定删除吗？",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            await axios.delete("/blog/_token/delete?id=" + id).then(res => {
                if (res.data.code == 200) {
                    message.success("删除成功")
                    loadBlos()
                } else {
                    message.error(res.data.msg)
                }
            })
        },
        onNegativeClick: () => { }
    });


}
</script>

<style lang="scss" scoped></style>