import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 查询外键级联扩展详情
   */
  get (cascadeExtId) {
    return request.get(`/${apiPath}/meta_cascade_ext/${cascadeExtId}`)
  },
  /**
   * 查询外键级联扩展列表
   */
  getList (fieldId) {
    return request.get(`/${apiPath}/meta_cascade_ext/list`,
      {
        params: {
          fieldId
        }
      })
  },
  /**
   * 保存外键级联扩展
   */
  saveOrUpdate (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_cascade_ext/save`
    let method = 'post'
    if (isUpdate) {
      saveURL = `/${apiPath}/meta_cascade_ext/update`
      method = 'put'
    }
    return request[method](saveURL, data)
  },
  /**
   * 批量删除外键级联扩展
   */
  deleteBatch (data) {
    return request.put(`/${apiPath}/meta_cascade_ext/delete_batch`, data)
  }

}
