<template>
  <el-dialog title="编辑需求列表" :visible.sync="formVisible">
    <el-form ref="dataForm" :rules="formRules" :model="form"
             label-position="left" size="small"
             label-width="100px" style="width: 400px; margin-left:50px;">
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
import demandsApi from '@/api/demands'

function initFormBean () {
  const formBean = {
    id: null
  }
  return formBean
}

export default {
  name: 'DemandsEdit',
  data () {
    return {
      old: initFormBean(),
      form: initFormBean(),
      formVisible: false,
      formRules: {
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
      demandsApi.fetchById(id)
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
        .then(() => demandsApi.update(this.form))
        .then(data => {
          this.formVisible = false
          this.$common.showMsg('success', '修改成功')
          this.$emit('updated', data)
        })
    }
  }
}
</script>
