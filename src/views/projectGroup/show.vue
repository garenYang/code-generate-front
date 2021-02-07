<template>
  <el-dialog title="查看项目" :visible.sync="formVisible">
    <el-form ref="dataForm" :model="form"
             label-position="left" size="small"
             label-width="100px"  style="margin:0 50px;">
      <el-form-item label="主键">
        <span class="form-item-show">
          {{ form.id }}
        </span>
      </el-form-item>
      <el-form-item label="项目名称">
        <span class="form-item-show">
          {{ form.projectGroupName }}
        </span>
      </el-form-item>
      <el-form-item label="排序号">
        <span class="form-item-show">
          {{ form.orderNo }}
        </span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import projectGroupApi from '@/api/projectgroup/projectGroup'

export default {
  name: 'ProjectGroupShow',
  data () {
    return {
      form: {
        id: null,
        projectGroupName: null,
        orderNo: null
      },
      formVisible: false
    }
  },
  methods: {
    /**
     * 打开查看表单
     */
    handleShow (id) {
      projectGroupApi.fetchById(id)
        .then(data => {
          this.form = data
          this.formVisible = true
        })
    }
  }
}
</script>
