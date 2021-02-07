<template>
  <el-dialog append-to-body title="编辑项目集" :visible.sync="formVisible">
    <el-form ref="dataForm" :rules="formRules" :model="form"
             label-position="left" size="small"
             label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item label="立项项目集名称" prop="projectGroupName">
        <el-input v-model="form.projectGroupName"/>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNo">
        <el-input-number v-model="form.orderNo" style="width:100%;" controls-position="right"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">
        取消
      </el-button>
      <el-button type="primary"
                 @click="doUpdate()">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import projectGroupApi from '@/api/projectgroup/projectGroup'

function initFormBean () {
  const formBean = {
    id: null,
    projectGroupName: null,
    orderNo: null
  }
  return formBean
}

export default {
  name: 'ProjectGroupEdit',
  data () {
    return {
      old: initFormBean(),
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
      for (const key in initFormBean()) {
        this.form[key] = this.old[key]
      }
    },
    /**
     * 打开编辑表单
     */
    handleUpdate (id) {
      projectGroupApi.fetchById(id)
        .then(data => {
          this.old = data
          this.resetForm()
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
    },
    /**
     * 执行修改操作
     */
    doUpdate () {
      this.$refs['dataForm'].validate()
        .then(() => projectGroupApi.update(this.form))
        .then(data => {
          this.formVisible = false
          this.$common.showMsg('success', '修改成功')
          this.$emit('updated', data)
        })
    }
  }
}
</script>
