<!-- 富文本组件 -->
<template>
    <div>
        <!-- 富文本编辑器工具栏 -->
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
            <!-- 富文本编辑器 -->
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
// 导入编辑器和工具栏组件
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
// 工具栏配置，屏蔽上传视频功能
const toolbarConfig = { excludeKeys:["uploadVideo"] };
const editorConfig = { placeholder: '请输入内容...' };

// 上传图片配置
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    //小于10kb的图片转为base64（文本形式）
    base64LimitSize: 10 * 1024, // 10kb
    server: server_url+'/upload/rich_editor_upload',
}
//插入图片配置
editorConfig.MENU_CONF['insertImage'] ={
    //插入图片之前执行的函数
    parseImageSrc:(src) =>{
        //查看图片是否包含http，如果没有则加上服务器地址
        if(src.indexOf("http") !==0){
            return `${server_url}${src}`
        }
        return src
    }
}

const mode = ref("default")
const valueHtml = ref("")

const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})
//双向绑定，让外层可以修改内部的值以及内部修改外部的值
const emit = defineEmits(["update:model-value"])
let initFinished = false

onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true;
    }, 200);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    if (initFinished) {
        emit("update:model-value", valueHtml.value)
    }
};

</script>

<style lang="scss" scoped>
</style>