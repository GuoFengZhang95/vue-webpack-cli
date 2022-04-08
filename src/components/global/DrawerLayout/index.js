import globalDrawer from './index.vue'
import router from '../../../router'
import store from '../../../store'

// 定义插件对象
const GlobalDrawer = {}
// vue的install方法，用于定义vue插件
/* eslint-disable-next-line no-unused-vars */
GlobalDrawer.install = function (Vue, options) {
  // options 通常用于插件的全局设置
  Vue.mixin({
    beforeRouteLeave: function (to, from, next) {
      if (currentGlobalDrawer) {
        currentGlobalDrawer.close()
      }
      next()
    },
  })
  const GlobalDrawerInstance = Vue.extend(globalDrawer)
  let currentGlobalDrawer = null
  // 创建元素
  const initInstance = opts => {
    // 创建新的vdom节点
    currentGlobalDrawer = new GlobalDrawerInstance()
    currentGlobalDrawer._router = router
    currentGlobalDrawer._route = router.currentRoute
    currentGlobalDrawer.$store = store
    // 挂载生成dom
    const parent = opts?.options?.parent
    let globalDrawerEl = null
    globalDrawerEl = currentGlobalDrawer.$mount().$el
    if (parent) {
      parent.$el.appendChild(globalDrawerEl)
      parent.$children.push(currentGlobalDrawer)
    } else {
      document.body.appendChild(globalDrawerEl)
    }
  }
  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$globalDrawer = {
    // 创建并展示globalDrawer
    show(opts) {
      let globalDrawerEl = document.getElementById('drawer-layout-wrp')
      if (globalDrawerEl) {
        return currentGlobalDrawer.show(opts)
      } else {
        initInstance(opts)
        return currentGlobalDrawer.show(opts)
      }
    },
    // close
    close() {
      currentGlobalDrawer.close()
    },
    // 向globalDrawer中添加新的组件
    add(opts) {
      return currentGlobalDrawer.add(opts)
    },
    // 返回globalDrawer中的上一个组件
    back() {
      return currentGlobalDrawer.back()
    },
    // 刷新侧拉框内的当前组件
    reload() {
      return currentGlobalDrawer.reload()
    },
  }
}
export default GlobalDrawer
