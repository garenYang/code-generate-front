<template>
  <el-dialog title="查看模块功能点" :visible.sync="formVisible">
    <el-form ref="dataForm" :model="form"
             label-position="left" size="small"
             label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item label="主键">
        <span class="form-item-show">
          {{ form.id }}
        </span>
      </el-form-item>
      <el-form-item label="功能名称">
        <span class="form-item-show">
          {{ form.functionName }}
        </span>
      </el-form-item>
      <el-form-item label="功能描述">
        <span class="form-item-show">
          {{ form.functionDesc }}
        </span>
      </el-form-item>
      <el-form-item label="功能点开发状态">
        <span class="form-item-show">
          {{ form.status }}
        </span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import fsdApi from '@/api/fsd/fsd'

export default {
  name: 'FsdShow',
  data () {
    return {
      form: {
        id: null,
        prdId: null,
        functionName: null,
        functionDesc: null,
        status: null
      },
      formVisible: false
    }
  },
  methods: {
    /**
     * 打开查看表单
     */
    handleShow (id) {
      fsdApi.fetchById(id)
        .then(data => {
          this.form = data
          this.formVisible = true
        })
    }
  }
}
</script>
