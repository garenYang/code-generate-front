<template>
  <el-dialog title="新建需求文档管理" :visible.sync="formVisible">
    <el-form ref="dataForm" :rules="formRules" :model="form"
             label-position="left" size="small"
             label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item label="项目ID" prop="projectId">
        <el-input v-model="form.projectId"/>
      </el-form-item>
      <el-form-item label="父节点ID" prop="parentId">
        <el-input v-model="form.parentId"/>
      </el-form-item>
      <el-form-item label="父节点ID列表" prop="parentIds">
        <el-input v-model="form.parentIds"/>
      </el-form-item>
      <el-form-item label="需求文档标题" prop="title">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item label="节点类型" prop="leaf">
        <el-input v-model="form.leaf"/>
      </el-form-item>
      <el-form-item label="节点排序" prop="sort">
        <el-input v-model="form.sort"/>
      </el-form-item>
      <el-form-item label="需求详情" prop="content">
        <el-input v-model="form.content"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">
        取消
      </el-button>
      <el-button type="primary"
                 @click="doCreate()">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import prdApi from '@/api/prd/prd'

function initFormBean () {
  const formBean = {
    projectId: null,
    parentId: null,
    parentIds: null,
    title: null,
    leaf: null,
    sort: null,
    content: null
  }
  return formBean
}

export default {
  name: 'PrdAdd',
  data () {
    return {
      form: initFormBean(),
      formVisible: false,
      formRules: {
        projectId: [
          { required: true, message: '请输入项目ID', trigger: 'blur' },
          { max: 11, message: '长度不能超过11个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请输入父节点ID', trigger: 'blur' },
          { max: 32, message: '长度不能超过32个字符', trigger: 'blur' }
        ],
        parentIds: [
          { max: 2000, message: '长度不能超过2000个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入需求文档标题', trigger: 'blur' },
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ],
        leaf: [
          { required: true, message: '请输入节点类型', trigger: 'blur' },
          { max: 1, message: '长度不能超过1个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入节点排序', trigger: 'blur' },
          { max: 11, message: '长度不能超过11个字符', trigger: 'blur' }
        ],
        content: [
          { max: 2000, message: '长度不能超过2000个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
     * 重置表单
     */
    resetForm () {
      this.form = initFormBean()
    },
    /**
     * 打开新建表单
     */
    handleCreate () {
      this.resetForm()
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 执行新建操作
     */
    doCreate () {
      this.$refs['dataForm'].validate()
        .then(() => prdApi.create(this.form))
        .then(data => {
          this.formVisible = false
          this.$common.showMsg('success', '创建成功')
          this.$emit('created', data)
        })
    }
  }
}
</script>
