/**
 * 自定义插件模块
 */
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
  /**
   * token，每次都得使用
   * const AUTH_TOKEN = localStorage.getItem('token')
   * this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
   * 请求发生之前需要对请求进行拦截处理，并设置相关的内容
   */
  // 添加请求拦截器：请求发起之前会先到此处的回调函数
  axios.interceptors.request.use(function (config) {
  /**
   * 发送请求前干的事情
   * config.url在设置了baseURL后会自动返回除baseURL的部分
   */
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.common['Authorization'] = AUTH_TOKEN
    }

    return config
  }, function (error) {
  // 对请求错误做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
    console.log('axios-response', response)
    return response
  }, function (error) {
  // 对响应错误做点什么
    return Promise.reject(error)
  })

  // 给原型属性添加成员
  Vue.prototype.$http = axios
}

// 导出
export default MyHttpServer
