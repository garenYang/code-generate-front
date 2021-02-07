function initFormBean (projectId) {
  const formBean = {
    name: '',
    title: '',
    module: '',
    projectId: projectId,
    layout: []
  }
  return formBean
}

function initLayout (chartId) {
  return {
    x: 0,
    y: 0,
    w: 6,
    h: 6,
    i: chartId,
    showCard: true,
    showTitle: true
  }
}

function getRules () {
  return {
    name: [
      { required: true, message: '请输入看板名称', trigger: 'blur' },
      { max: 64, message: '长度不能超过64个字符', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (!/^[A-Z](\w*(_|\$)*\w*)*$/.test(value)) {
            callback(new Error('不符合类名规范'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    module: [
      { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
    ],
    title: [
      { required: true, message: '请输入看板标题', trigger: 'blur' },
      { max: 64, message: '长度不能超过64个字符', trigger: 'blur' }
    ]
  }
}

export default {
  initFormBean,
  getRules,
  initLayout
}
