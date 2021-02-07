import { request, apiPath } from '@/utils/request'
const curPath = `/${apiPath}/db/projectDb`
const projectDbApi = {
  /**
   * 新增【数据源配置】
   */
  create (data) {
    return request.post(curPath, data)
  },
  /**
   * 修改【数据源配置】
   */
  update (data) {
    return request.put(curPath, data)
  },
  /**
   * 分页查询【数据源配置】
   */
  fetchList (query) {
    return request.get(curPath, { params: query })
  },
  /**
   * 查看【数据源配置】详情
   */
  fetchById (id) {
    return request.get(`${curPath}/${id}`)
  },
  /**
   * 删除单个【数据源配置】
   */
  deleteById (id) {
    return request.delete(`${curPath}/${id}`)
  },
  /**
   * 批量删除【数据源配置】
   */
  deleteBatch (ids) {
    return request.delete(curPath, { data: ids })
  },
  /**
   * 测试数据库连接
   */
  testConnection (data) {
    return request.post(`${curPath}/test-connection`, data)
  },
  /**
   * 获取数据库的所有表
   */
  allTables (data) {
    return request.post(`${curPath}/all-tables`, data)
  },
  /**
   * 生成选中数据表的DDL
   */
  generateDdl (data) {
    return request.post(`${curPath}/generate-ddl`, data)
  }

}
export default projectDbApi
