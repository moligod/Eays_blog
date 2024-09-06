<template>
  <div>

    <n-button @click="showAddModel = true">添加</n-button>

    <!-- 列表 -->
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>姓名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, inidex) in CategoryList">
          <td>{{ category.id }}</td>
          <td>{{ category.name }}</td>
          <td><n-space>
              <n-button @click="toUpdate(category)">修改</n-button>
              <n-button @click="deleteCategory(category)">删除</n-button>
            </n-space></td>
        </tr>
      </tbody>
    </n-table>

    <!-- 添加 -->
    <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
      <template #header>
        <div>添加分类</div>
      </template>
      <div>
        <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
      </div>
      <template #action>
        <div>
          <n-button @click="add">提交</n-button>
        </div>
      </template>
    </n-modal>

     <!-- 修改 -->
     <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
      <template #header>
        <div>修改分类</div>
      </template>
      <div>
        <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
      </div>
      <template #action>
        <div>
          <n-button @click="update">提交</n-button>
        </div>
      </template>
    </n-modal>

  </div>

</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
//路由
const router = useRouter()
const route = useRoute()
//弹窗、对话框、异步请求
const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
//总览store数据-token等等
const adminStore = AdminStore()
//弹窗开关
const showAddModel = ref(false)
const showUpdateModel = ref(false)
//数据-列表
const CategoryList = ref([])
//数据-发送给后端前准备的数据
const addCategory = reactive({ name: "" })
const updateCategory = reactive({ id:0,name: "" })


//界面加载时调用
onMounted(() => {
  loadDatas()
})
//获取列表数据功能
const loadDatas = async () => {
  let result = await axios.get("/category/list");
  CategoryList.value = result.data.rows
}


//添加功能-准备数据
const add = async () => {
  let result = await axios.post("/category/_token/add", { name: addCategory.name })
  //添加成功后自动刷新列表，并且把添加的分类信息清空
  if (result.data.code == 200) {
    message.success("添加成功")
    loadDatas()
    addCategory.name = ""
  } else {
    message.error("添加失败")
  }
}


//修改功能-准备区域，准备数据+准备弹窗
const toUpdate = (category) => {
  updateCategory.id = category.id
  updateCategory.name = category.name
  showUpdateModel.value = true
}
//修改功能-提交区域，提交数据+关闭弹窗
const update = async () => {
  let result = await axios.put("/category/_token/update", { id:updateCategory.id,name: updateCategory.name })
  if (result.data.code == 200) {
    message.success("修改成功")
    loadDatas()
    updateCategory.name = ""
  } else {
    message.error("修改失败")
  }
  showUpdateModel.value = false
}


//删除功能-准备区域，准备数据+准备弹窗
const deleteCategory = async (category) => {
  dialog.warning({
    title: "警告",
    content: "你确定删除吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async() => {
      let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
      if (res.data.code == 200) {
        message.success("删除成功")
        loadDatas()
      } else {
        message.error("删除失败")
      }
    },
    onNegativeClick: () => { }
  });

}



</script>

<style lang="scss" scoped></style>