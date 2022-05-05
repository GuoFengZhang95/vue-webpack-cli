
import axios from 'axios'

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
    // console.log(config)
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
    // console.log(response)
    const res = response.data
    Promise.resolve(res)
  },
  error => {
    console.log('error' + error)
    return Promise.reject(error)
  }
)

export default service
