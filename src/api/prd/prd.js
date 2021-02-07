import { request, apiPath } from '@/utils/request'
import { downloadBlob } from '@/utils/download'
const curPath = `/${apiPath}/prd`
const prdApi = {
  /**
   * 新增【需求文档管理】
   */
  create (data) {
    return request.post(curPath, data)
  },
  /**
   * 修改【需求文档管理】
   */
  update (data) {
    return request.put(curPath, data)
  },
  /**
   * 分页查询【需求文档管理】
   */
  fetchList (query) {
    return request.get(curPath, { params: query })
  },
  /**
   * 查询【需求文档管理】选项列表
   */
  findOptions (query) {
    return request.get(`${curPath}/options`, { params: query })
  },
  /**
   * 查看【需求文档管理】详情
   */
  fetchById (id) {
    return request.get(`${curPath}/${id}`)
  },
  /**
   * 删除单个【需求文档管理】
   */
  deleteById (id) {
    return request.delete(`${curPath}/${id}`)
  },
  /**
   * 批量删除【需求文档管理】
   */
  deleteBatch (ids) {
    return request.delete(curPath, { data: ids })
  },
  /**
   * 导出【需求文档管理】excel
   */
  exportExcel (query) {
    return request.get(`${curPath}/export`, { responseType: 'blob', params: query })
      .then(res => downloadBlob(res, 'prdExport.xlsx'))
  },
  /**
   * 下载【需求文档管理】模板
   */
  downloadTemplate () {
    request.get(`${curPath}/template`, { responseType: 'blob' })
      .then(res => downloadBlob(res, 'prdTemplate.xlsx'))
  },
  /**
   * 获取【需求文档管理】上传路径
   */
  getImportUrl () {
    return request.defaults.baseURL + curPath + '/import'
  },
  /**
   * 获取需求树
   */
  getTree (projectGroupId) {
    return request.get(`${curPath}/trees?projectGroupId=${projectGroupId}`)
  }
}
export default prdApi
