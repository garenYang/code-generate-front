<template>
  <el-dialog title="查看需求文档管理" :visible.sync="formVisible">
    <el-form ref="dataForm" :model="form"
             label-position="left" size="small"
             label-width="100px" style="width: 400px; margin-left:50px;">
      <el-form-item label="主键">
        <span class="form-item-show">
          {{ form.id }}
        </span>
      </el-form-item>
      <el-form-item label="项目ID">
        <span class="form-item-show">
          {{ form.projectId }}
        </span>
      </el-form-item>
      <el-form-item label="父节点ID">
        <span class="form-item-show">
          {{ form.parentId }}
        </span>
      </el-form-item>
      <el-form-item label="父节点ID列表">
        <span class="form-item-show">
          {{ form.parentIds }}
        </span>
      </el-form-item>
      <el-form-item label="需求文档标题">
        <span class="form-item-show">
          {{ form.title }}
        </span>
      </el-form-item>
      <el-form-item label="节点类型">
        <span class="form-item-show">
          {{ form.leaf }}
        </span>
      </el-form-item>
      <el-form-item label="节点排序">
        <span class="form-item-show">
          {{ form.sort }}
        </span>
      </el-form-item>
      <el-form-item label="需求详情">
        <span class="form-item-show">
          {{ form.content }}
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
import prdApi from '@/api/prd/prd'

export default {
  name: 'PrdShow',
  data () {
    return {
      form: {
        id: null,
        projectId: null,
        parentId: null,
        parentIds: null,
        title: null,
        leaf: null,
        sort: null,
        content: null
      },
      formVisible: false
    }
  },
  methods: {
    /**
     * 打开查看表单
     */
    handleShow (id) {
      prdApi.fetchById(id)
        .then(data => {
          this.form = data
          this.formVisible = true
        })
    }
  }
}
</script>
