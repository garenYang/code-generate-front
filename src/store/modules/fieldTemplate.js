const state = {
  /**
   * 缓存的字段模板数量
   */
  cacheFieldTemplateCount: 0,
  /**
   * 已缓存的字段模板
   */
  cacheFieldTemplate: [],
  /**
   * 待缓存的字段模板
   */
  toCacheFieldTemplate: []
}

const getters = {
  /**
   * 判断字段是否已经被缓存
   * @param state
   * @returns {function(*): boolean}
   */
  fieldCached (state) {
    return (fieldId) => !!state.cacheFieldTemplate.find(t => t.fieldId === fieldId)
  },
  /**
   * 判断字段是否即将被缓存
   * @param state
   * @returns {function(*): boolean}
   */
  fieldToCache (state) {
    return (fieldId) => !!state.toCacheFieldTemplate.find(t => t.fieldId === fieldId)
  }
}

const mutations = {
  /**
   * 从缓存中移除字段模板
   * @param state
   * @param fieldId
   */
  removeFieldTemplate: (state, fieldId) => {
    const index = state.cacheFieldTemplate.findIndex(item => item.fieldId === fieldId)
    if (index > -1) {
      state.cacheFieldTemplate.splice(index, 1)
      state.cacheFieldTemplateCount--
    }
  },
  /**
   * 往缓存中添加字段模板
   * @param state
   * @param field
   */
  addFieldTemplate: (state, field) => {
    const index = state.cacheFieldTemplate.findIndex(item => item.fieldId === field.fieldId)
    if (index < 0) {
      state.cacheFieldTemplate.push(field)
      state.cacheFieldTemplateCount++
    }
  },
  /**
   * 往待缓存列表中添加字段模板
   * @param state
   * @param field
   */
  addToCacheFieldTemplate: (state, field) => {
    const index = state.toCacheFieldTemplate.findIndex(item => item.fieldId === field.fieldId)
    if (index < 0) {
      state.toCacheFieldTemplate.push(field)
    }
  },
  /**
   * 移除待缓存列表中的字段模板
   * @param state
   * @param field
   */
  removeToCacheFieldTemplate: (state, field) => {
    const index = state.toCacheFieldTemplate.findIndex(item => item.fieldId === field.fieldId)
    if (index > -1) {
      state.toCacheFieldTemplate.splice(index, 1)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
