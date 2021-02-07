<template>
  <el-dialog title="新建需求列表" :visible.sync="formVisible">
    <el-form ref="dataForm" :rules="formRules" :model="form"
             label-position="left" size="small"
             label-width="100px" style="width: 400px; margin-left:50px;">
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
import demandsApi from '@/api/demands'

function initFormBean () {
  const formBean = {
  }
  return formBean
}

export default {
  name: 'DemandsAdd',
  data () {
    return {
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
        .then(() => demandsApi.create(this.form))
        .then(data => {
          this.formVisible = false
          this.$common.showMsg('success', '创建成功')
          this.$emit('created', data)
        })
    }
  }
}
</script>
