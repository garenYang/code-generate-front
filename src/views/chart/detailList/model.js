import chartModel from '../chartModel'

function initDetailListFormBean (projectId) {
  const formBean = {
    chartId: null,
    projectId: projectId,
    sourceId: null,
    chartName: '',
    module: '',
    title: '',
    defaultPageSize: 10,
    excelExport: true,
    columnList: [],
    hiddenColumnList: []
  }
  return formBean
}

/**
 * 从明细列构建图表项
 */
function initChartItemByDetailColumn (detailColumn) {
  const sourceItemId = detailColumn.sourceItemId
  let alias
  let titleAlias
  if (detailColumn.custom) {
    alias = 'custom' + sourceItemId
    titleAlias = '【自定义列】'
  } else {
    alias = detailColumn.field.jfieldName
    titleAlias = detailColumn.field.fieldDesc
  }
  return {
    sourceItemId: sourceItemId,
    alias: alias,
    titleAlias: titleAlias,
    showFkTitle: false,
    valuePrefix: '',
    valueSuffix: '',
    percent: false,
    format: '',
    detailColumn: detailColumn
  }
}

/**
 * 模拟表格数据
 */
function mockTableData (rowIndex, chartItem, constDetails) {
  const detailColumn = chartItem.detailColumn
  if (!detailColumn) {
    return ''
  }
  let value
  if (detailColumn.custom) {
    // TODO 根据自定义字段类型进行mock
    value = rowIndex + 1
  } else {
    if (detailColumn.field) {
      value = mockFieldValue(rowIndex, detailColumn.field, constDetails)
    } else {
      value = rowIndex + 1
    }
  }
  if (chartItem.valuePrefix) {
    value = chartItem.valuePrefix + value
  }
  if (chartItem.valueSuffix) {
    value = value + chartItem.valueSuffix
  }
  return value
}

function mockFieldValue (rowIndex, field, constDetails) {
  if (field.dicType && constDetails[field.dicType] && constDetails[field.dicType].length) {
    const details = constDetails[field.dicType]
    return details[rowIndex % details.length].detailRemark
  }
  return field.fieldExample
}

function getRules () {
  return {
    ...chartModel.getRules(),
    defaultPageSize: [
      { required: true, message: '请输入每页记录数', trigger: 'blur' }
    ],
    columnList: [
      { required: true, type: 'array', message: '请设置明细列', trigger: 'blur' }
    ]
  }
}

export default {
  initDetailListFormBean,
  initChartItemByDetailColumn,
  mockTableData,
  getRules
}
