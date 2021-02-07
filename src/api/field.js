import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 查询字段详情
   */
  get (fieldId) {
    return request.get(`/${apiPath}/meta_field/${fieldId}`)
  },
  /**
   * 查询实体下的字段列表
   */
  getList (entityId, withCascadeFieldNum) {
    return request.get(`/${apiPath}/meta_field/list`,
      {
        params: {
          entityId,
          withCascadeFieldNum
        }
      })
  },
  /**
   * 获取多个字段信息
   */
  getListByFieldIds (fieldIds) {
    return request.get(`/${apiPath}/meta_field/list`,
      {
        params: {
          fieldId: fieldIds.join(','),
          withCascadeFieldNum: false
        }
      })
  },
  /**
   * 保存字段
   */
  saveOrUpdate (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_field/save`
    let method = 'post'
    if (isUpdate) {
      saveURL = `/${apiPath}/meta_field/update`
      method = 'put'
    }
    return request[method](saveURL, data)
  },
  /**
   * 修改字段序号
   */
  updateOrderNo (fieldId, orderNo) {
    return request.put(`/${apiPath}/meta_field/update_order_no`,
      {
        fieldId,
        orderNo
      })
  },
  /**
   * 批量删除字段
   */
  deleteBatch (data) {
    return request.put(`/${apiPath}/meta_field/delete_batch`, data)
  }

}
