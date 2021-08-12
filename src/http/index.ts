import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router/index'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000
})


// 请求拦截
// 每一次发请求前做的事情
http.interceptors.request.use((config: AxiosRequestConfig) => {
  // 验证用户身份 
  // token: 令牌
  // 在登录成功之后后端签发令牌
  // 每一次发请求的时候 加上这个令牌
  let token = localStorage.getItem('token')
  if (token) {
    // headers属性是后端约定的
    config.headers['Authorization'] = token
  }
  return config
}, (err: AxiosError) => {
  return Promise.reject(err)
})


// 响应拦截
// 响应拦截每一次请求结束做的事情
http.interceptors.response.use((res: any) => {
  return res.data
}, (err: AxiosError) => {
  let status: number = err.response! && err.response!.status
  switch (status) {
    case 400:
      ElMessage.error('参数错误')
      break;
    case 401:
      // token是有过期时间的
      // 登录过期
      // 跳转到登录页
      ElMessage.error('登录过期')
      router.push('/login')
      break
    case 403:
      ElMessage.error('没有权限')
      break
    case 404:
      ElMessage.error('路径错误')
      break
    case 500:
      ElMessage.error('服务器错误')
      break
    case 503:
      ElMessage.error('服务器维护')
      break;
  }
  return Promise.reject(err)
})


export default http