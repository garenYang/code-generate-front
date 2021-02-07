<template>
  <el-dialog title="模板导入"
             :visible.sync="importTemplateFormVisible"
             v-loading="importTemplateFormLoading"
             class="importTemplateForm"
             width="400px">
    <el-upload drag
               :action="importTemplateUrl"
               :on-success="onImportTemplateSuccess"
               :on-progress="onImportTemplateProgress"
               :on-error="onImportTemplateError"
               :show-file-list="false">
               <!--accept="application/zip">-->
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将zip文件拖到此处，或 <em>点击上传</em></div>
    </el-upload>
    <div class="download-template">
      <div>
        <span>下载最新模板：</span>
        <a class="download-url" target="_blank"
           href="http://192.101.10.9:7000/cpdp-framework/dev-template/release/raw/master/templates/devp-template-cloud-1.0.1-src.zip">
          【后端工程模板】
        </a>
        <a class="download-url" target="_blank"
           href="http://192.101.10.9:7000/cpdp-framework/dev-template/release/raw/master/templates/devp-template-vue-1.0.1-src.zip">
          【前端工程模板】
        </a>
      </div>
      <div>
        <span>查看所有模板：</span>
        <a class="download-url" target="_blank"
           href="http://192.101.10.9:7000/cpdp-framework/dev-template/release">
          【云原生应用脚手架工程模版仓库】
        </a>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { apiPath } from '@/utils/request'
import eventHub from '@/utils/event-hub'

export default {
  name: 'import-template',
  data () {
    return {
      importTemplateFormLoading: false,
      importTemplateFormVisible: false,
      importTemplateUrl: `/${apiPath}/code_template/import`
    }
  },
  methods: {
    onImportTemplateProgress (event, file, fileList) {
      this.importTemplateFormLoading = true
    },
    onImportTemplateSuccess (response, file, fileList) {
      this.importTemplateFormVisible = false
      this.importTemplateFormLoading = false
      this.$common.showMsg('success', '导入成功')
      eventHub.$emit('import-template-success')
    },
    onImportTemplateError (error, file, fileList) {
      this.importTemplateFormLoading = false
      this.$common.showNotifyError(JSON.parse(error.message))
      eventHub.$emit('import-template-error', error)
    },
    show () {
      this.importTemplateFormVisible = true
    }
  },
  created: function () {
    eventHub.$on('import-template-show', this.show)
  }
}
</script>
<style lang="scss">
  .importTemplateForm {
    .download-template {
      margin: 30px 10px;
      font-weight: bold;
      .download-url {
        margin-left: 0;
        font-weight: normal;
        color: #409EFF;
      }
    }
  }
</style>
