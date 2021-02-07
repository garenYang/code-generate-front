<template>
  <el-dialog append-to-body title="项目导入"
             :visible.sync="importFormVisible"
             v-loading="importFormLoading"
             width="400px">
    <el-upload drag
               :action="importUrl"
               :on-success="onImportSuccess"
               :on-progress="onImportProgress"
               :on-error="onImportError"
               :show-file-list="false">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将excel文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-button @click="downloadTemplate"
               type="text" size="medium">点击下载excel模板</el-button>
  </el-dialog>
</template>
<script>
import projectGroupApi from '@/api/projectgroup/projectGroup'

export default {
  name: 'ProjectGroupImport',
  data () {
    return {
      importFormLoading: false,
      importFormVisible: false,
      importUrl: projectGroupApi.getImportUrl()
    }
  },
  created: function () {
  },
  methods: {
    onImportProgress (event, file, fileList) {
      this.importFormLoading = true
    },
    onImportSuccess (response, file, fileList) {
      this.importFormVisible = false
      this.importFormLoading = false
      this.$common.showMsg('success', '导入成功')
      this.$emit('imported', response)
    },
    onImportError (error, file, fileList) {
      this.importFormLoading = false
      this.$common.showNotifyError(JSON.parse(error.message))
    },
    show () {
      this.importFormVisible = true
    },
    downloadTemplate () {
      projectGroupApi.downloadTemplate()
    }
  }
}
</script>
