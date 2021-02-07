
export function cInitFormBean () {
  const formBean = {
    id: null,
    projectGroupId: null,
    parentId: null,
    parentIds: null,
    title: null,
    leaf: null,
    sort: null,
    content: null
  }
  return formBean
}

export function cGetRules () {
  return {
    title: [
      { required: true, message: '请输入需求文档标题', trigger: 'blur' },
      { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
    ],
    sort: [
      { required: true, message: '请输入节点排序', trigger: 'blur' },
      { max: 100, type: 'number', message: '排序不能大于100', trigger: 'blur' }
    ],
    content: [
      { max: 2000, message: '长度不能超过2000个字符', trigger: 'blur' }
    ]
  }
}
