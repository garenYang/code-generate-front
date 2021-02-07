import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 查询索引详情
   */
  get (indexId) {
    return request.get(`/${apiPath}/meta_index/${indexId}`)
  },
  /**
   * 查询索引列表
   */
  getList (params) {
    return request.get(`/${apiPath}/meta_index/list`, { params: params })
  },
  /**
   * 保存索引
   */
  saveOrUpdate (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_index/save`
    let method = 'post'
    if (isUpdate) {
      saveURL = `/${apiPath}/meta_index/update`
      method = 'put'
    }
    return request[method](saveURL, data)
  },
  /**
   * 删除单个索引
   */
  deleteSingle (indexId) {
    return request.delete(`/${apiPath}/meta_index/${indexId}`)
  },
  /**
   * 移除索引字段
   */
  removeField (indexId, fieldIds) {
    return request.put(`/${apiPath}/meta_index/${indexId}/remove_field`, fieldIds)
  }

}
