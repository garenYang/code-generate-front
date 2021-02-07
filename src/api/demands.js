import { request, apiPath } from '@/utils/request'
import { downloadBlob } from '@/utils/download'
const curPath = `/${apiPath}/demands`
const demandsApi = {
  /**
   * 新增【需求列表】
   */
  create (data) {
    return request.post(
      curPath, data
    )
  },
  /**
   * 修改【需求列表】
   */
  update (data) {
    return request.put(
      curPath, data
    )
  },
  /**
   * 分页查询【需求列表】
   */
  fetchList (query) {
    return request.get(
      curPath, { params: query }
    )
  },
  /**
   * 查看【需求列表】详情
   */
  fetchById (id) {
    return request.get(
      `${curPath}/${id}`
    )
  },
  /**
   * 删除单个【需求列表】
   */
  deleteById (id) {
    return request.delete(
      `${curPath}/${id}`
    )
  },
  /**
   * 批量删除【需求列表】
   */
  deleteBatch (ids) {
    return request.delete(
      curPath, { data: ids }
    )
  },
  /**
   * 导出【需求列表】excel
   */
  exportExcel (query) {
    return request.get(
      `${curPath}/export`, { responseType: 'blob', params: query })
      .then(res => downloadBlob(res, 'demandsExport.xlsx'))
  },
  /**
   * 下载【需求列表】模板
   */
  downloadTemplate () {
    request.get(`${curPath}/template`, { responseType: 'blob' })
      .then(res => downloadBlob(res, 'demandsTemplate.xlsx'))
  },
  /**
   * 获取【需求列表】上传路径
   */
  getImportUrl () {
    return request.defaults.baseURL + curPath + '/import'
  }
}
export default demandsApi
