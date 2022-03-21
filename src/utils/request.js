import { message } from 'ant-design-vue'
import qs from 'querystring'
// import router from '../router'
import Cookies from 'js-cookie'

import axios from 'axios'
const Jsonp = require('jsonp')

import { loginCheckJump } from '@/api/login.js'

// ========== jsonp请求 ==========
function jsonp(opts) {
  let { baseURL, url, params } = opts
  return new Promise((resolve, reject) => {
    Jsonp(`${baseURL}/${url}?${qs.stringify(params)}`, (err, data) => {
      // console.log(err, data)
      if (!err) {
        resolve(data)
      } else {
        reject(err)
        // console.log(err)
      }
    })
  })
}
// ========== 创建axios实例 ==========
const service = axios.create({
  // baseURL: '/test', // url = base url + request url
  crossDomain: true, // 跨域
  withCredentials: true, // 跨域请求发送cookie
  timeout: 20000, // 超时时间
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    config.params = Object.assign({}, config.params ? config.params : { t: new Date().getTime() })//兼容IE请求缓存
    return config
  },
  error => {
    // eslint-disable-next-line no-console
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (Reflect.has(res, 'success')) {
      return phpResHandle(res)
    } else {
      return javaResHandle(res)
    }
  },
  error => {
    // eslint-disable-next-line no-console
    console.log('err' + error)
    return Promise.reject(error)
  }
)

function request(opts) {
  if (opts.jsonp) {
    return jsonp(opts)
  } else {
    return service(opts)
  }
}

function phpResHandle(res) {
  if (res.success === false) {
    // 登陆过期
    if (res.msg === '登录超时,请重新登录') {
      localStorage.removeItem('eosUserInfo')
      Cookies.remove('is_login', { path: '/', domain: '.17m17.com' })
      loginCheckJump()
      return Promise.reject(res)
    }
    return res
  } else {
    return res
  }
}

function javaResHandle(res) {
  if (res.code !== '0') {
    // 登陆过期
    if (res.code === '100001') {
      localStorage.removeItem('eosUserInfo')
      Cookies.remove('is_login', { path: '/', domain: '.17m17.com' })
      loginCheckJump()
      return Promise.reject(res)
    }
    if (res.msg !== '暂无查看全部权限') {
      message.error(res.msg, 2)
    }
    return res
  } else {
    return res
  }
}

export default request
