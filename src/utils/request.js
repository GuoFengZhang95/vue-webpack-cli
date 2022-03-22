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
    return res
  },
  error => {
    // eslint-disable-next-line no-console
    console.log('err' + error)
    return Promise.reject(error)
  }
)

function request(opts) {
  return service(opts)
}

export default request
