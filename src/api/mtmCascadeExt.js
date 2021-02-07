import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 查询多对多级联扩展详情
   */
  get (mtmCascadeExtId) {
    return request.get(`/${apiPath}/meta_mtm_cascade_ext/${mtmCascadeExtId}`)
  },
  /**
   * 查询多对多级联扩展列表
   */
  getList (mtmId, entityId, cascadeEntityId) {
    return request.get(`/${apiPath}/meta_mtm_cascade_ext/list`,
      {
        params: {
          mtmId,
          entityId,
          cascadeEntityId
        }
      })
  },
  /**
   * 保存多对多级联扩展
   */
  saveOrUpdate (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_mtm_cascade_ext/save`
    let method = 'post'
    if (isUpdate) {
      saveURL = `/${apiPath}/meta_mtm_cascade_ext/update`
      method = 'put'
    }
    return request[method](saveURL, data)
  },
  /**
   * 批量删除多对多级联扩展
   */
  deleteBatch (data) {
    return request.put(`/${apiPath}/meta_mtm_cascade_ext/delete_batch`, data)
  }

}
