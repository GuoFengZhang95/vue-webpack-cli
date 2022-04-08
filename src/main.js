import Vue from 'vue'
import router from './router'
import App from './App'
import store from './store'

//权限文件
import './permission'

// 过滤器
import * as filters from './filters'
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

// 全局方法
import golbalTools from './utils/tools'
Vue.use(golbalTools)

// 全局组件
import MuUI from './components/index'
Vue.use(MuUI)

// 按需加载ant-design-vue组件
import './config/antd'
// 自定义全局样式文件
import '@/assets/style/common.less'

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
