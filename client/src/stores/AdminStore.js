//  Vue 应用中管理管理员相关的数据，存放token id name，周期是刷新则消失

import { defineStore } from 'pinia'

export const AdminStore = defineStore("admin", {

    state: () => {
        return {
            id: 0,
            account: "",
            token: ""
        }
    },
    actions: {},
    getters: {}

})
