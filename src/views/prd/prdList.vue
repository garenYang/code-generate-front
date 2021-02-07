<template>
  <div class="app-container">
    <div style="display: flex;justify-content: start">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>需求文档管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
<!--          <el-button class="filter-item" @click.native="handleAdd" type="success">创建工程</el-button>-->
<!--          <el-button class="filter-item" @click.native="handleImport" type="warning">元数据导入</el-button>-->
          <el-button class="filter-item" type="success"
                     icon="el-icon-edit" @click="appendTopNode">
            添加根节点
          </el-button>
          <el-button class="filter-item" type="success"
                     icon="el-icon-edit" @click="appendNode">
            添加子节点
          </el-button>
          <el-button class="filter-item" type="danger"
                     icon="el-icon-edit" @click="deleteNode(selectedTreeNode)">
            删除
          </el-button>
        </el-col>
      </el-row>

    </div>
    <el-row type="flex" :gutter="20">
      <el-col :span="6"  class="activeNum">
        <el-card style="height: 100%">
          <prd-tree ref="prdTree" @treeSelectedNode="treeSelectedNode"></prd-tree>
        </el-card>
      </el-col>
      <el-col :span="18">

        <el-collapse v-model="activeNames">
          <el-collapse-item name="doc">
            <template slot="title">
              <el-row type="flex" style="width: 100%" align="middle" :gutter="20">
                <el-col :span="6">
                  需求说明<i class="header-icon el-icon-info"></i>
                </el-col>
                <el-col :span="18" style="text-align: right; margin-bottom: 10px;">

                </el-col>
              </el-row>
            </template>
            <div>
              <el-form ref="cForm" :rules="cRules" :model="cForm"
                       label-position="left" size="small"
                       label-width="120px" style="width: 100%; ">
                <el-form-item label="需求文档标题" prop="title">
                  <el-input v-model="cForm.title"/>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                  <el-input-number v-model="cForm.sort"
                                   :min="0" :max="100" ></el-input-number>
                </el-form-item>
                <el-form-item label="需求详情" prop="content">
                  <markdown-editor ref="markdownEditor"
                                   v-model="cForm.content"
                                   :options="markdownOptions"
                                   language="zh_CN"
                                   height="400px" />
                </el-form-item>
                <el-form-item>
                  <el-button size="small" class="filter-item" type="primary"
                             icon="el-icon-edit" @click="saveNode()">
                    保存
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="list">
            <template slot="title">
              故事点列表<i class="header-icon el-icon-info"></i>
            </template>
            <div>
              <devp-fsd-list></devp-fsd-list>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <!-- 新建表单 -->
    <prd-add ref="prdAdd" @created="doQueryList({ currentPage: 1 })"/>
    <!-- 编辑表单 -->
    <prd-edit ref="prdEdit" @updated="doQueryList({})"/>
    <!-- 查看表单 -->
    <prd-show ref="prdShow"/>
    <!-- 查看表单 -->
    <prd-import ref="prdImport" @imported="doQueryList({ currentPage: 1 })"/>

    <el-dialog  :visible.sync="showSelectProject" width="60%">
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
  </div>
</template>

<script>
import prdAdd from './add'
import prdEdit from './edit'
import prdShow from './show'
import prdImport from './import'
import prdApi from '@/api/prd/prd'

import MarkdownEditor from '@/components/MarkdownEditor'
import ExportProjectGroupList from '@/views/projectGroup/exportList'
import { mapState } from 'vuex'
import { cGetRules, cInitFormBean } from './custom/model'
import PrdTree from './custom/prdTree'
import DevpFsdList from '../fsd/custom/DevpFsdList'

export default {
  name: 'PrdList',
  components: {
    PrdTree,
    prdAdd,
    prdEdit,
    prdShow,
    prdImport,
    MarkdownEditor,
    ExportProjectGroupList,
    DevpFsdList
  },
  data () {
    return {
      // 项目
      currentRow: null,
      selectedProjectGroup: null,
      showSelectProject: false,
      // 1
      markdownOptions: {
        hideModeSwitch: false,
        previewStyle: 'tab'
      },
      remark: null,
      cRules: cGetRules(),
      cForm: cInitFormBean(),

      // 需求树
      selectedTreeNode: null,

      // 需求管理
      activeNames: ['doc', 'list'],

      selectedNode: null,
      treeData: [],
      value: null,
      list: [],
      total: 0,
      listLoading: true,
      query: {
        currentPage: 1,
        pageSize: 10,
        projectId: null,
        title: '',
        createdTimeSortSign: 0,
        operatedTimeSortSign: 0
      },
      selectItems: []
    }
  },
  computed: {
    ...mapState({
      systemUserInfo: state => state.systemUserInfo,
      projectGroup () { return this.$store.state.projectGroup }
    })
  },
  created () {
    this.doQueryList({ currentPage: 1 })
    if (this.selectedProjectGroup) {
      this.$refs.prdTree.getTree(this.selectedProjectGroup.id)
    }
  },
  methods: {
    // 项目相关操作开始
    selectProject () {
      this.showSelectProject = true
    },
    clearProject () {
      this.selectedProjectGroup = null
      this.$store.state.projectGroup = null
    },
    /**
     * 项目选中状态
     */
    handleCurrentChange (val) {
      this.currentRow = val
    },
    closeDialog () {
      this.selectedProjectGroup = this.currentRow
      this.showSelectProject = false
      this.$store.state.projectGroup = this.selectedProjectGroup
      // 选中项目后查询 需求树
      this.$refs.prdTree.getTree(this.selectedProjectGroup.id)
    },
    /**
     *  新建项目
     */
    projectGroupAdd () {
      this.$refs.projectGroupList.handleCreate()
    },
    /**
     *  编辑项目
     */
    projectGroupUpdate (row) {
      this.$refs.projectGroupList.handleUpdate(row)
    },
    /**
     * 删除单条项目记录
     */
    projectGroupDelete (row) {
      this.$refs.projectGroupList.handleDeleteSingle(row)
    },
    // 项目相关操作结束
    treeSelectedNode (val) {
      // 需求树选中节点
      console.log('prdList-treeSelectedNode', val)
      this.selectedTreeNode = val
      // 设置右侧需要编辑的数据
      this.cForm = val
    },
    appendTopNode () {
      // 新增顶级需求节点
      if (!this.selectedProjectGroup) {
        this.$common.showMsg('error', '请先选中项目')
        return
      }
      this.cForm.parentId = '-1'
      this.cForm.projectGroupId = this.projectGroup.id
      this.cForm.sort = '0'
      this.cForm.title = '默认顶级需求'
      this.$refs.prdTree.doCreate(this.cForm)
    },
    appendNode () {
      // 新增需求子节点
      if (!this.selectedTreeNode) {
        this.$common.showMsg('error', '请先选中树节点')
        return
      }
      this.cForm = cInitFormBean()
      this.cForm.parentId = this.selectedTreeNode.id
      this.cForm.projectGroupId = this.selectedTreeNode.projectGroupId
      this.cForm.sort = '0'
      this.cForm.title = '默认节点需求'
      this.$refs.prdTree.doCreate(this.cForm)
    },
    deleteNode (treeNode) {
      // 删除节点
      this.$refs.prdTree.handleDeleteSingle(treeNode)
    },
    saveNode () {
      // 更新节点
      this.$refs['cForm'].validate()
        .then(data => {
          this.$refs.prdTree.doUpdate(this.cForm)
        })
    },

    // 需求树操作结束
    /**
     * 选择框变化
     */
    selectionChange (val) {
      this.selectItems = val
    },
    /**
     * 触发后端排序
     */
    sortChange ({ prop, order }) {
      const sortKeyMap = {
        'createdTime': 'createdTimeSortSign',
        'operatedTime': 'operatedTimeSortSign'
      }
      for (var k in sortKeyMap) {
        const sortKey = sortKeyMap[k]
        if (k !== prop) {
          this.query[sortKey] = null
        } else {
          if (order === 'ascending') {
            this.query[sortKey] = 1
          } else {
            this.query[sortKey] = -1
          }
        }
      }
      this.doQueryList({})
    },
    /**
     * 触发搜索操作
     */
    handleQuery () {
      this.doQueryList({ currentPage: 1 })
    },
    /**
     * 执行列表查询
     */
    doQueryList ({ currentPage, pageSize }) {
      if (currentPage) {
        this.query.currentPage = currentPage
      }
      if (pageSize) {
        this.query.pageSize = pageSize
      }
      this.listLoading = true
      return prdApi.fetchList(this.query)
        .then(data => {
          console.log('data', data)
          this.list = data.list
          this.total = data.total
        })
        .finally(() => {
          this.listLoading = false
        })
    },
    /**
     * 删除单条记录
     */
    handleDeleteSingle (row) {
      return this.$common.confirm('是否确认删除')
        .then(() => prdApi.deleteById(row.id))
        .then(() => {
          this.$common.showMsg('success', '删除成功')
          return this.doQueryList({ currentPage: 1 })
        })
    },
    /**
     * 批量删除记录
     */
    handleDeleteBatch () {
      if (this.selectItems.length <= 0) {
        this.$common.showMsg('warning', '请选择需求文档管理')
        return
      }
      return this.$common.confirm('是否确认删除')
        .then(() => prdApi.deleteBatch(this.selectItems.map(row => row.id)))
        .then(() => {
          this.$common.showMsg('success', '删除成功')
          return this.doQueryList({ currentPage: 1 })
        })
    },
    /**
     * 打开新建表单
     */
    handleCreate () {
      console.log(this.selectedNode)
      this.$refs.devpTree.parentData('111111')
      this.$refs.prdAdd.handleCreate()
    },
    /**
     * 打开查看表单
     */
    handleShow (row) {
      this.$refs.prdShow.handleShow(row.id)
    },
    /**
     * 打开编辑表单
     */
    handleUpdate (row) {
      this.$refs.prdEdit.handleUpdate(row.id)
    },
    /**
     * 导出excel
     */
    handleExport () {
      return this.$common.confirm('是否确认导出')
        .then(() => prdApi.exportExcel(this.query))
    },
    /**
     * 打开导入表单
     */
    handleImport () {
      this.$refs.prdImport.show()
    }
  }
}
</script>

<style lang="scss">

</style>
