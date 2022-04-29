import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

import WebStorage from '../views/js/web-storage.vue'

const routes = [
  {
    path: '/',
    // redirect: '/web-storage',
  },
  {
    path: '/web-storage',
    name: 'WebStorage',
    component: WebStorage
  }
]
const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
