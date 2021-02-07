import { request, apiPath } from '@/utils/request'
import store from '@/store'

export default {

  /**
   * 查询模板详情
   */
  get (templateId) {
    return request.get(`/${apiPath}/code_template/${templateId}`)
  },
  /**
   * 查询模板列表
   */
  getList () {
    return request.get(`/${apiPath}/code_template`)
  },
  /**
   * 保存模板
   */
  saveOrUpdate (data, isUpdate) {
    return request[isUpdate ? 'put' : 'post'](`/${apiPath}/code_template`, data)
  },
  /**
   * 批量删除模板
   */
  deleteBatch (data) {
    return request.delete(`/${apiPath}/code_template`, { data })
  },
  /**
   * 导出模板文件压缩包
   */
  exportZip (templateId) {
    const downloadUrl = `/${apiPath}/code_template/${templateId}/export`
    store.dispatch('app/downloadFile', downloadUrl)
  },
  /**
   * 复制模板
   */
  copy (templateId) {
    return request.post(`/${apiPath}/code_template/${templateId}/copy`)
  },
  /**
   * 查询模板目录树
   */
  getDirTree (templateId) {
    return request.get(`/${apiPath}/code_template/${templateId}/dir_tree`)
  },
  /**
   * 获取模板文件
   */
  getTemplateFile (fileId) {
    return request.get(`/${apiPath}/template_file/${fileId}`)
  },
  /**
   * 保存模板文件
   */
  saveOrUpdateTemplateFile (data, isUpdate) {
    return request[isUpdate ? 'put' : 'post'](`/${apiPath}/template_file`, data)
  },
  /**
   * 修改模板文件内容
   */
  updateTemplateFileContent (fileId, version, content) {
    return request.put(`/${apiPath}/template_file/${fileId}/content`,
      {
        version,
        content
      })
  },
  /**
   * 删除单个模板文件
   */
  deleteTemplateFile (fileId) {
    return request.delete(`/${apiPath}/template_file/${fileId}`)
  }

}
