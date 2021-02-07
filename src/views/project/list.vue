<template>
  <div class="projectList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>工程管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="filter-container">
      <el-row type="flex" align="middle" :gutter="20">
        <el-col :span="6"  class="activeNum">
          <span>当前项目：{{ selectedProjectGroup ? selectedProjectGroup.projectGroupName : '未选中项目' }}</span>
        </el-col>
        <el-col :span="18" style="text-align: right; margin-bottom: 10px;">
          <el-button type="primary" class="filter-item"
                     @click="selectProject()">选择项目</el-button>
          <el-button type="primary" class="filter-item"
                     @click="clearProject()">清除选中</el-button>
          <el-button class="filter-item" @click.native="handleAdd" type="success">创建工程</el-button>
          <el-button class="filter-item" @click.native="handleImport" type="warning">元数据导入</el-button>
        </el-col>
      </el-row>

    </div>
    <el-table ref="projectTable" :data="list" :border="true"
              row-key="projectId"
              style="min-width: 1255px;"
              v-loading="loading"
              :element-loading-text="loadingText">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column property="projectName" label="工程标识" width="120"></el-table-column>
      <el-table-column property="projectDesc" label="工程名称" width="200"></el-table-column>
      <el-table-column property="projectTeam" label="团队成员" width="80"></el-table-column>
      <el-table-column property="author" label="项目经理" width="80"></el-table-column>
      <el-table-column label="Git仓库" width="70px">
        <template v-slot="scope">
          <svg-icon v-if="scope.row.remote" className="table-cell-icon color-success" iconClass="check"></svg-icon>
          <svg-icon v-else className="table-cell-icon color-danger" iconClass="times"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column label="使用代码模板">
        <template v-slot="scope">
          <template v-for="template in [getTemplate(scope.row.templateId),
                                    getTemplate(scope.row.templateId2),
                                    getTemplate(scope.row.templateId3)]">
            <el-dropdown v-if="template"
                         :key="template.templateId"
                         size="small" trigger="click"
                         @command="handleCommand"
                         style="margin:5px;">
              <el-button type="primary" size="mini">
                {{ template.name }}v{{ template.templateVersion }}
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{method:'handleTemplateRemark',arg: [ scope.row , template.remark ]}">
                  <svg-icon className="dropdown-icon color-primary" iconClass="info"></svg-icon>
                  模板说明
                </el-dropdown-item>
                <el-dropdown-item :command="{method:'handlePreView',arg: [ scope.row , template.templateId ]}">
                  <svg-icon className="dropdown-icon color-success" iconClass="preview"></svg-icon>
                  代码预览
                </el-dropdown-item>
                <el-dropdown-item :command="{method:'handleGenCode',arg: [ scope.row , template.templateId ]}">
                  <svg-icon className="dropdown-icon color-primary" iconClass="code-download"></svg-icon>
                  下载代码
                </el-dropdown-item>
                <template v-if="scope.row.remote">
                  <el-dropdown-item :command="{method:'handleGitDiff',arg: [ scope.row , template.templateId ]}"
                                    divided>
                    <svg-icon className="dropdown-icon color-warning" iconClass="diff"></svg-icon>
                    增量预览
                  </el-dropdown-item>
                  <el-dropdown-item :command="{method:'handleCommit',arg: [ scope.row , template.templateId ]}">
                    <svg-icon className="dropdown-icon color-danger" iconClass="git"></svg-icon>
                    提交Git
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </template>
      </el-table-column>
      <!--代码下载进度条-->
      <el-table-column label="代码生成进度" width="110">
        <template v-slot="scope">
          <el-progress v-if="progressingProjectIds.includes(scope.row.projectId)"
                       :text-inside="true" :stroke-width="20"
                       :percentage="scope.row.genCodePercent"
                       :status="scope.row.genCodeStatus"></el-progress>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="210">
        <template v-slot="scope">
          <el-button @click="handleEntity(scope.row)" type="text" size="medium">实体管理</el-button>
          <el-button @click="handleConst(scope.row)" type="text" size="medium">枚举管理</el-button>
          <el-dropdown size="small" trigger="click" @command="handleCommand" style="margin-left:10px;">
        <span class="el-dropdown-link button-font">
          操作<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{method:'handleChart',arg:scope.row}">
                <svg-icon className="dropdown-icon color-success" iconClass="chart"></svg-icon>
                图表管理
              </el-dropdown-item>
              <el-dropdown-item :command="{method:'handleEdit',arg:scope.row}" divided>
                <svg-icon className="dropdown-icon color-primary" iconClass="edit"></svg-icon>
                编辑
              </el-dropdown-item>
              <el-dropdown-item v-if="isDeleteButtonVisible(scope.row)" :command="{method:'handleDel',arg:scope.row}">
                <svg-icon className="dropdown-icon color-danger" iconClass="trash"></svg-icon>
                删除
              </el-dropdown-item>
              <el-dropdown-item v-if="isShareButtonVisible(scope.row)" :command="{method:'handleShare',arg:scope.row}">
                <svg-icon className="dropdown-icon color-primary" iconClass="share"></svg-icon>
                共享
              </el-dropdown-item>
              <el-dropdown-item :command="{method:'handleReverseEngineering',arg:scope.row}" divided>
                <svg-icon className="dropdown-icon color-warning" iconClass="reverse-engineering"></svg-icon>
                反向工程
              </el-dropdown-item>
              <el-dropdown-item :command="{method:'handleExport',arg:scope.row}">
                <svg-icon className="dropdown-icon color-purple" iconClass="download"></svg-icon>
                导出元数据
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 元数据导入对话框 -->
    <import-project ref="importProject"
                    @success="onImportProjectSuccess"></import-project>
    <!-- 工程共享对话框 -->
    <el-dialog title="工程共享" :visible.sync="shareFormVisible" width="40%">
      <el-form ref="shareForm" :model="shareForm" size="small">
        <el-form-item label="共享给：" label-width="100px">
          <el-select style="width:90%;" v-model="shareForm.teamId"
                     placeholder="请选择项目组" tabindex="90" clearable>
            <el-option :label="'无'" :value="null"></el-option>
            <el-option
              v-for="item in teamList"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shareFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleShareSubmit">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 反向工程对话框 -->
    <el-dialog title="反向工程" :visible.sync="reverseEngineeringFormVisible" width="60%">
      <el-form ref="reverseEngineeringForm" :model="reverseEngineeringForm" :rules="reverseEngineeringFormRules" size="small">
        <el-form-item label="脚本语言：" label-width="100px">
          <el-radio-group v-model="reverseEngineeringForm.dbType">
            <el-radio border label="mysql">MySql</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="DDL脚本：" label-width="100px" prop="ddl">
          <el-input v-model="reverseEngineeringForm.ddl" type="textarea" :autosize="{ minRows: 10, maxRows: 1000}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button type="primary" @click="reverseEngineeringFormSourceVisible = true">从数据源获取DDL</el-button>
          </el-col>
          <el-col :span="18" style="text-align: right;">
            <el-button @click="reverseEngineeringFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleReverseEngineeringCheck">校 验</el-button>
            <el-button type="success" @click="handleReverseEngineeringSubmit">反向生成</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="reverseEngineeringFormSourceVisible" width="60%">
      <div slot="title" class="dialog-footer">
        <el-row type="flex" :gutter="20">
          <el-col :span="6" style="display:flex; align-items: center">
            数据源
          </el-col>
          <el-col :span="18" style="text-align: right; padding-right: 40px;">
            <span style="font-size: 12px; padding-right: 50px">{{ connecting | sourceConnectStatus}}</span>
            <el-button @click="reverseEngineeringFormSourceVisible = false">取 消</el-button>
            <el-button type="primary" :loading="connecting === 1" @click="handleReverseSourceLinkCheck">连接并获取所有表</el-button>
            <el-button type="success" :loading="generating" :disabled="connecting !== 2" @click="getDdl">获取DDL语句</el-button>
          </el-col>
        </el-row>
      </div>
      <el-form ref="reverseSourceLinkForm" label-width="70px"  :rules="reverseSourceFormRules" :model="reverseSourceForm" >
        <el-row >
          <el-col :span="8">
            <el-form-item label="Host" prop="dbHost">
              <el-input v-model="reverseSourceForm.dbHost" placeholder="数据库地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Port" prop="dbPort">
              <el-input v-model="reverseSourceForm.dbPort" placeholder="数据库端口"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库名" prop="dbName">
              <el-input v-model="reverseSourceForm.dbName" placeholder="库名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户名" prop="dbUser">
              <el-input v-model="reverseSourceForm.dbUser" placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="dbPassword">
              <el-input v-model="reverseSourceForm.dbPassword" placeholder="密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableNamesData"
        tooltip-effect="dark"
        style="width: 100%"
        @select-all="sourceTableSelectAll"
        @select="sourceSelectRow"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="表名">
        </el-table-column>
      </el-table>

    </el-dialog>

    <el-dialog title="模板说明" :visible.sync="templateRemarkVisible" width="60%">
      <div class="markdown-body" v-html="templateRemarkHtml"></div>
    </el-dialog>

    <el-dialog title="增量预览" :visible.sync="codeDiffVisible" :fullscreen="true">
      <div v-html="codeDiffHtml"></div>
    </el-dialog>

    <el-dialog  :visible.sync="showSelectProject" @cancel="cancleDialog()" width="60%">
      <div slot="title">
        <el-row :gutter="20">
          <el-col :span="6">
            项目管理
          </el-col>
          <el-col :span="12" :offset="6">
            <el-button size="small" type="success"
                       icon="el-icon-plus"
                       @click="projectGroupAdd"
            >新增</el-button>
            <el-button size="small" type="success"
                       icon="el-icon-edit"
                       :disabled="!currentRow"
                       @click="projectGroupUpdate(currentRow)"
            >修改</el-button>
            <el-button size="small" type="danger"
                       icon="el-icon-delete"
                       :disabled="!currentRow"
                       @click="projectGroupDelete(currentRow)"
            >删除</el-button>
            <el-button size="small" type="primary"
                       @click="closeDialog()"
            >确定</el-button>
          </el-col>
        </el-row>
      </div>
      <el-card style="height: 100%" body-style="padding:0">
        <div>
          <export-project-group-list ref="projectGroupList" @selectRow="handleCurrentChange"></export-project-group-list>
        </div>
      </el-card>
    </el-dialog>

    <code-preview ref="codePreview"></code-preview>

  </div>
</template>

<script>
import projectApi from '@/api/project'
import templateApi from '@/api/template'
import projectTeamApi from '@/api/team/projectTeam'
import CodePreview from './codePreview'
import ImportProject from './import'
import showdown from 'showdown'
// 文件差异对比工具 https://github.com/rtfpessoa/diff2html
import { html } from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'
import { mapState } from 'vuex'

import projectDbApi from '@/api/projectdb/projectDb'

import ExportProjectGroupList from '@/views/projectGroup/exportList'

const converter = new showdown.Converter({
  emoji: 'true',
  tables: 'true'
})

export default {
  name: 'projectList',
  components: {
    CodePreview,
    ImportProject,
    ExportProjectGroupList
  },
  data () {
    return {
      // DDL source start
      connecting: 0,
      generating: false,
      tableNamesData: [],
      reverseEngineeringFormSourceVisible: false,
      reverseSourceForm: {
        dbHost: null,
        dbPort: null,
        dbName: null,
        dbUser: null,
        dbPassword: null,
        dialectName: 'MYSQL',
        selectAll: 1,
        tableNames: []
      },
      reverseSourceFormRules: {
        dbHost: [
          { required: true, message: '请输入数据库服务器地址', trigger: 'blur' }
        ],
        dbPort: [
          { required: true, message: '请输入数据库端口', trigger: 'blur' }
        ],
        dbName: [
          { required: true, message: '请输入库名', trigger: 'blur' }
        ],
        dbUser: [
          { required: true, message: '请输入数据库用户名', trigger: 'blur' }
        ],
        dbPassword: [
          { required: true, message: '请输入数据库密码', trigger: 'blur' }
        ]
      },
      // DDL source end
      selectedProjectGroup: null,
      showSelectProject: false,
      tableData: [],
      currentRow: null,
      activeNum: 0,
      selectItems: [],
      list: [],
      loading: false,
      loadingText: '',
      shareFormVisible: false,
      shareForm: {
        projectId: null,
        teamId: null
      },
      reverseEngineeringFormVisible: false,
      reverseEngineeringForm: {
        projectId: null,
        dbType: 'mysql',
        ddl: ''
      },
      reverseEngineeringFormRules: {
        ddl: [
          { required: true, message: '请输入DDL脚本', trigger: 'blur' },
          { max: 10000, message: '长度不能超过10000个字符', trigger: 'blur' }
        ]
      },
      progressingProjectIds: [],
      templateList: [],
      teamList: [],
      templateRemarkVisible: false,
      templateRemarkHtml: '',
      codeDiffVisible: false,
      codeDiffHtml: '',
      query: {
        currentPage: 1,
        pageSize: 10,
        projectGroupId: null
      }
    }
  },
  computed: {
    ...mapState({
      systemUserInfo: state => state.systemUserInfo,
      projectGroup () { return this.$store.state.projectGroup }
    })
  },
  filters: {
    sourceConnectStatus: function (connecting) {
      let status = ''
      switch (connecting) {
        case 0:
          status = '未连接'
          break
        case 1:
          status = '连接中...'
          break
        case 2:
          status = '连接成功'
          break
        case 3:
          status = '连接异常'
          break
      }
      return status
    }
  },
  methods: {
    // 项目集合管理开始
    closeDialog () {
      this.selectedProjectGroup = this.currentRow
      console.log(this.selectedProjectGroup)
      this.showSelectProject = false
      this.$store.state.projectGroup = this.selectedProjectGroup
      this.paramsQuery(this.selectedProjectGroup)
    },
    clearProject () {
      this.selectedProjectGroup = null
      this.$store.state.projectGroup = null
      this.paramsQuery(this.selectedProjectGroup)
    },
    paramsQuery (selectedProjectGroup) {
      const params = {}
      params.currentPage = 1
      if (selectedProjectGroup) {
        params.projectGroupId = selectedProjectGroup.id
      }
      this.doQuery(params)
    },
    cancleDialog () {
      this.selectedProjectGroup = null
      console.log(this.selectedProjectGroup)
      this.showSelectProject = false
    },
    selectProject () {
      this.showSelectProject = true
    },

    /**
     *  新建项目集
     */
    projectGroupAdd () {
      this.$refs.projectGroupList.handleCreate()
    },
    /**
     *  编辑项目集
     */
    projectGroupUpdate (row) {
      this.$refs.projectGroupList.handleUpdate(row)
    },
    /**
     * 删除单条记录
     */
    projectGroupDelete (row) {
      this.$refs.projectGroupList.handleDeleteSingle(row)
    },
    /**
     * 左侧项目集列表选中行
     */
    handleCurrentChange (val) {
      console.log('val', val)
      this.currentRow = val
    },
    // 项目集合管理结束
    selectionChange (val) {
      this.selectItems = val
      this.activeNum = this.selectItems.length
    },
    /**
     * 是否显示删除按钮
     */
    isDeleteButtonVisible (row) {
      return row.createdBy === this.systemUserInfo.username
    },
    /**
     * 执行删除操作
     */
    handleDel (row) {
      this.$common.confirm('是否确认删除')
        .then(() => projectApi.deleteBatch([row.projectId]))
        .then(() => this.doQuery())
        .catch(error => this.$common.showNotifyError(error))
    },
    // 列表查询
    doQuery ({ currentPage, pageSize, projectGroupId }) {
      console.log(currentPage, pageSize, projectGroupId)
      if (currentPage) {
        this.query.currentPage = currentPage
      }
      if (pageSize) {
        this.query.pageSize = pageSize
      }
      if (projectGroupId) {
        this.query.projectGroupId = projectGroupId
      } else {
        delete this.query.projectGroupId
      }
      this.loading = true
      this.loadingText = '列表加载中'
      projectApi.getList(this.query)
        .then(data => {
          // 下载进度条数据初始化
          data.forEach(r => {
            r.genCodeStatus = null
            r.genCodePercent = 0
            r.genCodeMsg = ''
          })
          this.list = data
        })
        .catch(error => this.$common.showNotifyError(error))
        .finally(() => { this.loading = false })
    },
    loadProjectTeamList () {
      return projectTeamApi.findOptions()
        .then(data => {
          console.log(data)
          this.teamList = data
        })
    },
    getTemplateList () {
      return templateApi.getList()
        .then(data => {
          this.templateList = data
        })
        .catch(error => this.$common.showNotifyError(error))
    },
    getTemplate (templateId) {
      return this.templateList.find(t => t.templateId === templateId)
    },
    handleAdd () {
      this.$router.push('/project/add')
    },
    handleImport () {
      this.$refs.importProject.show()
    },
    onImportProjectSuccess () {
      this.doQuery()
    },
    handleEntity (row) {
      this.$router.push(`/project/${row.projectId}/entity`)
    },
    handleConst (row) {
      this.$router.push(`/project/${row.projectId}/const`)
    },
    handleChart (row) {
      this.$router.push(`/project/${row.projectId}/chart`)
    },
    handleEdit (row) {
      this.$router.push(`/project/edit/${row.projectId}`)
    },
    handleShow (row) {
      this.$router.push(`/project/show/${row.projectId}`)
    },
    handleExport (row) {
      projectApi.exportCodeZip(row.projectId)
    },
    handlePreView ([row, templateId]) {
      const projectId = row.projectId
      if (!this.validateProgressing(projectId)) {
        return
      }
      projectApi.callCodeGenWebSocketService(
        'gen_code',
        { 'projectId': projectId, 'templateId': templateId },
        () => this.progressingProjectIds.push(projectId),
        progressVO => this.rowProgressChange(row, progressVO)
      )
        .then(progressVO => {
          if (progressVO.status === 2) {
            this.$refs.codePreview.show(row.projectId, row.projectName, templateId)
          } else {
            this.$common.showNotifyError(progressVO.msg)
          }
        })
        .finally(() => this.removeProgress(row))
    },
    /**
     * 行进度条改变
     * @return boolean 进度是否结束
     */
    rowProgressChange (row, progressVO) {
      let done = false
      row.genCodePercent = progressVO.percentage
      row.genCodeMsg = progressVO.msg
      row.genCodeStatus = null
      // 进度完成
      if (progressVO.status === 2) {
        row.genCodeStatus = 'success'
        done = true
      }
      // 进度异常
      if (progressVO.status === 3) {
        row.genCodeStatus = 'exception'
        done = true
      }
      return done
    },
    handleGenCode ([row, templateId]) {
      const projectId = row.projectId
      if (!this.validateProgressing(projectId)) {
        return
      }
      this.$common.confirm('是否确认下载')
        .then(() => projectApi.callCodeGenWebSocketService(
          'gen_code_and_zip',
          { 'projectId': projectId, 'templateId': templateId },
          () => this.progressingProjectIds.push(projectId),
          progressVO => this.rowProgressChange(row, progressVO)
        ))
        .then(progressVO => {
          if (progressVO.status === 2) {
            this.$common.showMsg('success', progressVO.msg)
            // 下载代码文件
            projectApi.exportCodeZipBySessionId(progressVO.sessionId)
          } else {
            this.$common.showNotifyError(progressVO.msg)
          }
        })
        .finally(() => this.removeProgress(row))
    },
    /**
     * 是否显示共享按钮
     */
    isShareButtonVisible (row) {
      if (!this.systemUserInfo.teamEnabled) {
        return false
      }
      return row.createdBy === this.systemUserInfo.username
    },
    /**
     * 点击共享按钮后触发
     */
    handleShare (row) {
      this.shareFormVisible = true
      this.shareForm.projectId = row.projectId
      this.shareForm.teamId = row.teamId
    },
    /**
     * 点击共享提交按钮后触发
     */
    handleShareSubmit () {
      let loading = this.$loading()
      projectApi.share(this.shareForm)
        .then(() => {
          this.shareFormVisible = false
          this.$common.showMsg('success', '操作成功')
          this.doQuery()
        })
        .catch(error => this.$common.showNotifyError(error))
        .finally(() => {
          if (loading) {
            loading.close()
          }
        })
    },
    handleReverseEngineering (row) {
      this.reverseEngineeringFormVisible = true
      this.reverseEngineeringForm.projectId = row.projectId
      this.reverseEngineeringForm.ddl = ''
    },
    sourceTableSelectAll () {
      // 全选所有表
      this.reverseSourceForm.selectAll = 1
    },
    sourceSelectRow (selection, row) {
      // 选中和取消选中单行
      this.reverseSourceForm.selectAll = 0
      const tableNames = []
      selection.forEach(item => {
        tableNames.push(item.name)
      })
      this.reverseSourceForm.tableNames = tableNames
    },
    getSourceTable (form) {
      // 获取库中所有的数据
      projectDbApi.allTables(form)
        .then(res => {
          this.tableNamesData = []
          const finalData = []
          if (res.code === 1) {
            for (let name of res.data) {
              finalData.push({ name: name })
            }
            this.tableNamesData = finalData
          }
        })
    },
    getDdl () {
      this.$refs.reverseSourceLinkForm.validate()
        .then(() => {
          this.generating = true
          return projectDbApi.generateDdl(this.reverseSourceForm)
        })
        .then(res => {
          if (res.code === 1) {
            this.$common.showMsg('success', '获取成功')
            this.reverseEngineeringFormSourceVisible = false
            this.reverseEngineeringForm.ddl = res.data
          }
        }).catch(error => this.$common.showNotifyError(error))
        .finally(() => {
          this.generating = false
        })
    },
    handleReverseSourceLinkCheck () {
      // 测试数据库连接的正确性,正确则获取表数据
      this.$refs.reverseSourceLinkForm.validate()
        .then(() => {
          this.connecting = 1
          return projectDbApi.testConnection(this.reverseSourceForm)
        })
        .then(res => {
          if (res.code === 1) {
            if (res.data === 1) {
              this.connecting = 2
              this.getSourceTable(this.reverseSourceForm)
            } else {
              this.connecting = 3
              this.$common.showMsg('error', '数据库连接异常，请检查配置信息！')
            }
          }
        }).catch(error => this.$common.showNotifyError(error))
    },
    handleReverseEngineeringCheck () {
      let loading = null
      // 校验表单
      this.$refs.reverseEngineeringForm.validate()
        // 提交表单
        .then(() => {
          loading = this.$loading()
          return projectApi.reverseEngineeringCheck(this.reverseEngineeringForm)
        })
        .then(() => {
          this.$common.showMsg('success', '校验通过')
        })
        .catch(error => this.$common.showNotifyError(error))
        .finally(() => {
          if (loading) {
            loading.close()
          }
        })
    },
    handleReverseEngineeringSubmit () {
      let loading = null
      // 校验表单
      this.$refs.reverseEngineeringForm.validate()
        // 提交表单
        .then(() => {
          loading = this.$loading()
          return projectApi.reverseEngineeringExecute(this.reverseEngineeringForm)
        })
        .then(() => {
          this.$common.showMsg('success', '执行成功')
          this.reverseEngineeringFormVisible = false
        })
        .catch(error => this.$common.showNotifyError(error))
        .finally(() => {
          if (loading) {
            loading.close()
          }
        })
    },
    handleCommit ([row, templateId]) {
      const projectId = row.projectId
      if (!this.validateProgressing(projectId)) {
        return
      }
      projectApi.checkCommit(projectId, templateId)
        .then(checkCommitVO => {
          let msg = `首次提交代码到【${checkCommitVO.remoteUrl}】,是否继续？`
          if (!checkCommitVO.firstCommit) {
            const lastGen = checkCommitVO.lastGenHistory
            msg = `即将从【${checkCommitVO.remoteUrl}】拉取分支【${lastGen.branch}】并在此基础上执行增量提交,是否继续？`
          }
          return this.$common.confirm(msg)
        })
        .then(() => projectApi.callCodeGenWebSocketService(
          'git_commit',
          { 'projectId': projectId, 'templateId': templateId },
          () => this.progressingProjectIds.push(projectId),
          progressVO => this.rowProgressChange(row, progressVO)
        ))
        .then(progressVO => {
          if (progressVO.status === 2) {
            this.$common.showMsg('success', progressVO.msg)
          } else {
            this.$common.showNotifyError(progressVO.msg)
          }
        })
        .finally(() => this.removeProgress(row))
    },
    /**
     * 下载完成后移除进度条
     */
    removeProgress (row) {
      this.progressingProjectIds.splice(this.progressingProjectIds.findIndex(v => v === row.projectId), 1)
      row.genCodePercent = 0
    },
    handleCommand: function (command) {
      this[command.method](command.arg)
    },
    handleTemplateRemark ([row, remark]) {
      this.templateRemarkVisible = true
      this.templateRemarkHtml = converter.makeHtml(remark)
    },
    /**
     * 校验工程是否正在生成代码
     */
    validateProgressing (projectId) {
      if (this.progressingProjectIds.includes(projectId)) {
        this.$common.showNotifyError('代码生成中，请稍后再试')
        return false
      }
      return true
    },
    /**
     * 显示git代码差异
     */
    handleGitDiff ([row, templateId]) {
      const projectId = row.projectId
      if (!this.validateProgressing(projectId)) {
        return
      }
      projectApi.callCodeGenWebSocketService(
        'git_diff',
        { 'projectId': projectId, 'templateId': templateId },
        () => this.progressingProjectIds.push(projectId),
        progressVO => this.rowProgressChange(row, progressVO)
      )
        .then(progressVO => {
          if (progressVO.status === 2) {
            if (!progressVO.data) {
              this.$common.showNotifyError('代码无变动')
            } else {
              this.codeDiffHtml = html(progressVO.data, {
                inputFormat: 'diff',
                showFiles: true,
                matching: 'lines',
                outputFormat: 'line-by-line'
              })
              this.codeDiffVisible = true
            }
          } else {
            this.$common.showNotifyError(progressVO.msg)
          }
        })
        .finally(() => this.removeProgress(row))
    }
  },
  activated () {
    this.selectedProjectGroup = this.$store.state.projectGroup
    const params = {}
    params.currentPage = 1
    if (this.selectedProjectGroup) {
      params.projectGroupId = this.selectedProjectGroup.id
    }
    Promise.all([this.getTemplateList(), this.loadProjectTeamList()])
      .then(() => this.doQuery(params))
  }
}
</script>
<style lang="scss">
  @import '../../assets/common.scss';

  .project-table-expand-column {
    visibility: hidden;
  }

  .project-table-expand {
    margin: 0px 60px;

    .el-form-item {
      margin-bottom: 5px;
    }
  }

  .projectList {

    .active-row {
      background-color: #f5f7fa;
    }

    .activeNum {
      min-width: 160px;
      text-align: left;
      padding: 0 0 0 20px;
    }

    /**
     * 调整表格行高
     */
    .el-table td {
      padding: $el-table-padding;
    }

    /**
     * 操作按钮字体
     */
    .button-font {
      font: 400 13.3333px Arial;
    }
    /**
     * 模板版本标签
     */
    .template-version-tag {
      color: #FFFFFF;
      border: 2px solid transparent;
      border-radius:4px;
      margin: 0px;
      user-select: none;
      font-size: 10px;
      padding: 1px;
      background-color: $color-warning;
    }
  }
  /**
   * 下拉菜单图标
   */
  .dropdown-icon {
    font-size: 14px;
    margin-right: 0px;
    vertical-align: -4%;
  }
</style>
