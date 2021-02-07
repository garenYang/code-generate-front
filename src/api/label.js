import { apiPath, request } from '@/utils/request'

export default {

  /**
   * 获取扩展属性元数据
   * @param projectId  项目id
   * @param templateId 模板id
   * @param labelType  类型
   */
  findMetaLabel (projectId, templateId, labelType) {
    return request.get(`/${apiPath}/meta_label`,
      {
        params: {
          'projectId': projectId,
          'templateId': templateId,
          'labelType': labelType
        }
      })
  }

}
