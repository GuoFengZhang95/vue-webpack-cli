import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// 获取特定的上下文 通常用于自动化导入模块
/**
 * @param1 获取文件的路径
 * @param2 是否要遍历文件的子目录
 * @param3 匹配文件的正则
 */
// const modulesFiles = require.context('./modules', false, /\.js$/)

// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

import app from './modules/app'
import dictionary from './modules/dictionary'
import routes from './modules/routes/index'
import shopcart from './modules/shopcart'
import tagsView from './modules/tagsView'
import user from './modules/user'

const store = {
  modules: {
    app,
    dictionary,
    routes,
    shopcart,
    tagsView,
    user,
  },
  getters,
  state: {
    tabMax: 3,
    tabList: [], // 全部tab
    renderTab: [], // 展示tab
    extendTab: [], // 扩展tab
    spinning: {
      value: false,
      label: '',
    },
    subSpinning: {
      value: false,
      label: '',
    },
    drawerFlag: false,
    drawerList: [],
  },
  mutations: {
    // 打开|关闭全局侧拉
    toggleDrawer(state, data) {
      // drawerFlag 侧拉||收起
      if (data.drawerFlag) {
        // drawerComponent 进入2级||返回上一层
        if (data.drawerComponent) {
          let flag = !!data.isListItem //非列表进入标识isListItem
          if (flag) {
            //判断是否从列表进入 若列表进入清空显示历史记录
            state.drawerList = []
          }
          state.drawerList.push(data.drawerComponent)
          let idx = state.drawerList.findIndex(
            e => e.name === data.drawerComponent.name
          )
          if (idx < 0) {
            console.log('不存在记录内')
          } else if (idx === state.drawerList.length - 1) {
            console.log('存在记录内且不为最后一项')
          } else {
            console.log('存在记录内且为最后一项')
          }
        } else {
          state.drawerList.pop()
        }
      } else {
        state.drawerList = []
      }
      state.drawerFlag = data.drawerFlag
    },
  },
}

export default new Vuex.Store(store)
