import { request, apiPath } from '@/utils/request'

export default {

  /**
   * 查询看板详情
   */
  get (dashboardId) {
    return request.get(`/${apiPath}/meta_dashboard/${dashboardId}`)
  },
  /**
   * 查询项目下的看板列表
   */
  getList (projectId) {
    return request.get(`/${apiPath}/meta_dashboard`,
      {
        params: {
          projectId,
          moduleSortSign: 1
        }
      })
  },
  /**
   * 保存看板
   */
  saveOrUpdate (data, isUpdate) {
    return request[isUpdate ? 'put' : 'post'](`/${apiPath}/meta_dashboard`, data)
  },
  /**
   * 删除单个看板
   */
  deleteSingle (dashboardId) {
    return request.delete(`/${apiPath}/meta_dashboard/${dashboardId}`)
  }

}
