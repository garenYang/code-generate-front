import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 查询实体详情
   */
  get (entityId) {
    return request.get(`/${apiPath}/meta_entity/${entityId}`)
  },
  /**
   * 查询项目下的实体列表
   */
  getList (projectId) {
    return request.get(`/${apiPath}/meta_entity/list`,
      {
        params: {
          projectId,
          moduleSortSign: 1
        }
      })
  },
  /**
   * 保存实体
   */
  saveOrUpdate (data, isUpdate) {
    let saveURL = `/${apiPath}/meta_entity/save`
    let method = 'post'
    if (isUpdate) {
      saveURL = `/${apiPath}/meta_entity/update`
      method = 'put'
    }
    return request[method](saveURL, data)
  },
  /**
   * 修改实体特性
   */
  updateFeature (entityId, data) {
    return request.put(`/${apiPath}/meta_entity/${entityId}/feature`, data)
  },
  /**
   * 批量删除实体
   */
  deleteBatch (data) {
    return request.put(`/${apiPath}/meta_entity/delete_batch`, data)
  },
  /**
   * 查询多对多关联实体
   */
  getMtmEntityListPair (entityId) {
    return request.get(`/${apiPath}/meta_entity/${entityId}/mtm_entity_list_pair`)
  },
  /**
   * 校验实体内部数据
   */
  validateEntityInner (projectId, entityId) {
    return request.get(`/${apiPath}/meta_validate/${projectId}/entity_inner/${entityId}`)
  },
  /**
   * 获取某实体作为外键关联时的默认外键名(mysql字段名)
   */
  getDefaultFkFieldNameForSql (entityId) {
    return request.get(`/${apiPath}/meta_entity/${entityId}/default_fk_field_name_for_sql`,
      {
        responseType: 'text'
      })
  },
  /**
   * 查询ER图数据
   */
  getErDiagram (projectId, entityIds) {
    return request.get(`/${apiPath}/er_diagram/show`,
      {
        params: {
          projectId,
          entityIds
        }
      })
  }

}
