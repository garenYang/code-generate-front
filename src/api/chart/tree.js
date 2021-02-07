import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 获取结构树详情
   */
  get (chartId) {
    return request.get(`/${apiPath}/meta_chart/tree/${chartId}`)
  },
  /**
   * 保存结构树
   */
  saveOrUpdate (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_chart/tree`
    let method = isUpdate ? 'put' : 'post'
    return request[method](saveURL, data)
  }

}
