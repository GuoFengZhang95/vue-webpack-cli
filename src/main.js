import Vue from 'vue'
import router from './router'
import App from './App'
import store from './store'
//权限文件
import './permission'

// 全局组件
import MuUI from './components/index'
Vue.use(MuUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
