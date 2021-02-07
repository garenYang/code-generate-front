import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 获取柱线图详情
   */
  get (chartId) {
    return request.get(`/${apiPath}/meta_chart/bar_line/${chartId}`)
  },
  /**
   * 保存柱线图
   */
  saveOrUpdate (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_chart/bar_line`
    let method = isUpdate ? 'put' : 'post'
    return request[method](saveURL, data)
  }

}
