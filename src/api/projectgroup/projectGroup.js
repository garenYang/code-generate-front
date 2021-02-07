import { request, apiPath } from '@/utils/request'
import { downloadBlob } from '@/utils/download'
const curPath = `${apiPath}/projectgroup/projectGroup`
const projectGroupApi = {
  /**
   * 新增【项目】
   */
  create (data) {
    return request.post(curPath, data)
  },
  /**
   * 修改【项目】
   */
  update (data) {
    return request.put(curPath, data)
  },
  /**
   * 分页查询【项目】
   */
  fetchList (query) {
    return request.get(curPath, { params: query })
  },
  /**
   * 查看【项目】详情
   */
  fetchById (id) {
    return request.get(`${curPath}/${id}`)
  },
  /**
   * 删除单个【项目】
   */
  deleteById (id) {
    return request.delete(`${curPath}/${id}`)
  },
  /**
   * 批量删除【项目】
   */
  deleteBatch (ids) {
    return request.delete(curPath, { data: ids })
  },
  /**
   * 导出【项目】excel
   */
  exportExcel (query) {
    return request.get(`${curPath}/export`, { responseType: 'blob', params: query })
      .then(res => downloadBlob(res, 'projectGroupExport.xlsx'))
  },
  /**
   * 下载【项目】模板
   */
  downloadTemplate () {
    request.get(`${curPath}/template`, { responseType: 'blob' })
      .then(res => downloadBlob(res, 'projectGroupTemplate.xlsx'))
  },
  /**
   * 获取【项目】上传路径
   */
  getImportUrl () {
    return request.defaults.baseURL + curPath + '/import'
  }
}
export default projectGroupApi
