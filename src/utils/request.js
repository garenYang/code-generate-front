import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

export const baseApiUrl = process.env.VUE_APP_BASE_API_URL
export const apiPath = process.env.VUE_APP_API_PATH
export const wsApiPath = process.env.VUE_APP_WS_API_PATH
export const request = axios.create({
  baseURL: baseApiUrl,
  timeout: 60000,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  paramsSerializer (params) {
    return qs.stringify(params, {
      arrayFormat: 'repeat'
    })
  }
})

// response interceptor
request.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // const data = response.data
    // if (response.status >= 200 && response.status < 300) {
    //   return data
    // } else {
    //   return Promise.reject(new Error(data))
    // }
    return new Promise((resolve, reject) => {
      if (response.status >= 200 && response.status < 300) {
        return resolve(response.data)
      } else {
        return reject(new Error(response.data))
      }
    })
  },
  error => {
    let message = error.message
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 校验服务器返回结果
export const checkResult = function (response) {
  return new Promise((resolve, reject) => {
    if (response.status >= 200 && response.status < 300) {
      return resolve(response.data)
    } else {
      return reject(new Error(response.data))
    }
  })
}
