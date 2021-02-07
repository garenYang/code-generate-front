import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 获取图表数据源及其数据项
   */
  getWithItems (sourceId) {
    return request.get(`/${apiPath}/meta_chart_source/${sourceId}/with_items`)
  },
  /**
   * 保存图表及其所有数据项
   */
  saveOrUpdateWithItems (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_chart_source/with_items`
    let method = isUpdate ? 'put' : 'post'
    return request[method](saveURL, data)
  },
  /**
   * 批量删除图表
   */
  deleteBatch (data) {
    return request.put(`/${apiPath}/meta_chart_source`, data)
  }

}
