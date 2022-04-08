import Vue from 'vue'
import VueRouter from 'vue-router'

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

import Layout from '@/layout'
import yqmmpro from './modules/yqmmpro'
import ai from './modules/ai'
import eos from './modules/eos'
import system from './modules/system'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [...yqmmpro, ...ai, ...eos, ...system, ...ai],
  },
  {
    path: '/dashboard',
    name: 'SaasDashboard',
    meta: { title: '工作台' },
    component: () => import('@/views/dashboard'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录页面' },
    component: () => import('@/views/login/index'),
  },
  // 修改密码页面
  {
    path: '/password',
    name: 'Password',
    meta: { title: '修改密码' },
    component: () => import('@/views/login/password'),
  },
  // 第三方授权回跳页面
  {
    path: '/bind',
    name: 'LoginBind',
    meta: { title: '第三方授权' },
    component: () => import('@/views/login/bind'),
  },
  // 分销推广页
  {
    path: '/eosadver',
    name: 'EosAdver',
    component: () => import('@/views/eos/advertisement/index'),
  },
  // 分销资格申请页面
  {
    path: '/eosapply',
    name: 'EosApply',
    component: () => import('@/views/eos/apply/index'),
  },
  // 403
  {
    path: '/403',
    name: 'Page403',
    component: () => import('@/views/errorpage/403'),
  },
  {
    path: '*',
    name: 'Page404',
    component: () => import('@/views/errorpage/404'),
  },
]
const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router
