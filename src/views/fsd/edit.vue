<template>
  <el-dialog title="编辑模块功能点" :visible.sync="formVisible">
    <el-form ref="dataForm" :rules="formRules" :model="form"
             label-position="left" size="small"
             label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item label="功能模块ID" prop="prdId">
        <el-select v-model="form.prdId"
                   style="width:100%;" placeholder="请选择"
                   filterable clearable>
          <el-option v-for="item in options.prd"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能名称" prop="functionName">
        <el-input v-model="form.functionName"/>
      </el-form-item>
      <el-form-item label="功能描述" prop="functionDesc">
        <el-input v-model="form.functionDesc"/>
      </el-form-item>
      <el-form-item label="功能点开发状态" prop="status">
        <el-input v-model="form.status"/>
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
import fsdApi from '@/api/fsd/fsd'
import prdApi from '@/api/prd/prd'

function initFormBean () {
  const formBean = {
    id: null,
    prdId: null,
    functionName: null,
    functionDesc: null,
    status: null
  }
  return formBean
}

export default {
  name: 'FsdEdit',
  data () {
    return {
      options: {
        prd: []
      },
      old: initFormBean(),
      form: initFormBean(),
      formVisible: false,
      formRules: {
        prdId: [
          { required: true, message: '请输入功能模块ID', trigger: 'change' }
        ],
        functionName: [
          { required: true, message: '请输入功能名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        functionDesc: [
          { required: true, message: '请输入功能描述', trigger: 'blur' },
          { max: 2000, message: '长度不能超过2000个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入功能点开发状态', trigger: 'blur' },
          { max: 2, message: '长度不能超过2个字符', trigger: 'blur' }
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
      prdApi.findOptions().then(data => { this.options.prd = data })
      fsdApi.fetchById(id)
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
        .then(() => fsdApi.update(this.form))
        .then(data => {
          this.formVisible = false
          this.$common.showMsg('success', '修改成功')
          this.$emit('updated', data)
        })
    }
  }
}
</script>
