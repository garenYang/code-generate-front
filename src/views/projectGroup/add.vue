<template>
  <el-dialog append-to-body title="新建项目集" :visible.sync="formVisible">
    <el-form ref="dataForm" :rules="formRules" :model="form"
             label-position="left" size="small"
             label-width="100px" style="margin:0 50px;">
      <el-form-item label="项目名称" prop="projectGroupName">
        <el-input v-model="form.projectGroupName"/>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNo">
        <el-input-number v-model="form.orderNo" controls-position="right"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取消</el-button>
      <el-button type="primary" @click="doCreate()">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import projectGroupApi from '@/api/projectgroup/projectGroup'

function initFormBean () {
  const formBean = {
    projectGroupName: null,
    orderNo: null
  }
  return formBean
}

export default {
  name: 'ProjectGroupAdd',
  data () {
    return {
      form: initFormBean(),
      formVisible: false,
      formRules: {
        projectGroupName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { max: 255, message: '长度不能超过255个字符', trigger: 'blur' }
        ],
        orderNo: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
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
        .then(() => projectGroupApi.create(this.form))
        .then(data => {
          this.formVisible = false
          this.$common.showMsg('success', '创建成功')
          this.$emit('created', data)
        })
    }
  }
}
</script>
