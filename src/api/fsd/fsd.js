import { request, apiPath } from '@/utils/request'
import { downloadBlob } from '@/utils/download'
const curPath = `/${apiPath}/fsd`
const fsdApi = {
  /**
   * 新增【模块功能点】
   */
  create (data) {
    return request.post(curPath, data)
  },
  /**
   * 修改【模块功能点】
   */
  update (data) {
    return request.put(curPath, data)
  },
  /**
   * 分页查询【模块功能点】
   */
  fetchList (query) {
    return request.get(curPath, { params: query })
  },
  /**
   * 查看【模块功能点】详情
   */
  fetchById (id) {
    return request.get(`${curPath}/${id}`)
  },
  /**
   * 删除单个【模块功能点】
   */
  deleteById (id) {
    return request.delete(`${curPath}/${id}`)
  },
  /**
   * 批量删除【模块功能点】
   */
  deleteBatch (ids) {
    return request.delete(curPath, { data: ids })
  },
  /**
   * 导出【模块功能点】excel
   */
  exportExcel (query) {
    return request.get(`${curPath}/export`, { responseType: 'blob', params: query })
      .then(res => downloadBlob(res, 'fsdExport.xlsx'))
  },
  /**
   * 下载【模块功能点】模板
   */
  downloadTemplate () {
    request.get(`${curPath}/template`, { responseType: 'blob' })
      .then(res => downloadBlob(res, 'fsdTemplate.xlsx'))
  },
  /**
   * 获取【模块功能点】上传路径
   */
  getImportUrl () {
    return request.defaults.baseURL + curPath + '/import'
  }
}
export default fsdApi
