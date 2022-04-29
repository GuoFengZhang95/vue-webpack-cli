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



const store = {
  modules: {},
  getters,
  state: {},

}

export default new Vuex.Store(store)
