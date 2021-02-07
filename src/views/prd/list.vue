<template>
  <div class="app-container">
    <div style="display: flex;justify-content: start">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>需求文档管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="filter-item" style="margin-left: 10px;" type="success"
                 icon="el-icon-edit" @click="appendNode">
        添加子节点
      </el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" style="height: 100%"  class="activeNum">
        <el-card  class="el-card" style="height: 100%">
          <div slot="header" class="clearfix">
            <el-select style="width: 100%" v-model="value" placeholder="请选择">
              <el-option
                v-for="item in projectList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div >
            <devp-tree ref="devpTree" @selectNode="treeSelectedNode" :data.sync="treeData"></devp-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-row type="flex" align="top" :gutter="20">
            <el-col style="height: 100%;" :span="6" >
              <div>
                已选择{{ 'activeNum' }}个工程
              </div>
            </el-col>
            <el-col :span="18" style="text-align: right; margin-bottom: 10px;">
              <el-input v-model="query.projectId" placeholder="项目ID"
                        style="width: 200px;" class="filter-item"
                        @keyup.enter.native="handleQuery"/>
              <el-input v-model="query.title" placeholder="需求文档标题"
                        style="width: 200px;" class="filter-item"
                        @keyup.enter.native="handleQuery"/>
              <el-button class="filter-item" icon="el-icon-search" type="primary"
                         @click="handleQuery">
                搜索
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="success"
                         icon="el-icon-edit" @click="handleCreate">
                新建
              </el-button>
              <el-button class="filter-item" style="margin-left: 10px;" type="danger"
                         icon="el-icon-delete" @click="handleDeleteBatch">
                删除
              </el-button>
              <el-button class="filter-item" icon="el-icon-download" type="warning"
                         @click="handleExport">
                导出
              </el-button>
              <el-button class="filter-item" icon="el-icon-upload2" type="success"
                         @click="handleImport">
                导入
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-table v-loading="listLoading" :data="list"
                  @selection-change="selectionChange"
                  @sort-change="sortChange"
                  border stripe style="width: 100%;">
          <el-table-column type="selection" width="50"/>
          <el-table-column label="主键"
                           prop="id"
                           align="center" width="100">
            <template slot-scope="{row}">
              <span>{{ row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="项目ID"
                           prop="projectId"
                           align="center">
            <template slot-scope="{row}">
              <span>{{ row.projectId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="父节点ID"
                           prop="parentId"
                           align="center">
            <template slot-scope="{row}">
              <span>{{ row.parentId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="父节点ID列表"
                           prop="parentIds"
                           align="center">
            <template slot-scope="{row}">
              <span>{{ row.parentIds }}</span>
            </template>
          </el-table-column>
          <el-table-column label="需求文档标题"
                           prop="title"
                           align="center">
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="节点类型"
                           prop="leaf"
                           align="center">
            <template slot-scope="{row}">
              <span>{{ row.leaf }}</span>
            </template>
          </el-table-column>
          <el-table-column label="节点排序"
                           prop="sort"
                           align="center">
            <template slot-scope="{row}">
              <span>{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间"
                           prop="createdTime"
                           sortable="custom"
                           align="center" width="200">
            <template slot-scope="{row}">
              <span>{{ row.createdTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间"
                           prop="operatedTime"
                           sortable="custom"
                           align="center" width="200">
            <template slot-scope="{row}">
              <span>{{ row.operatedTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230">
            <template slot-scope="{row}">
              <el-button size="mini"
                         @click="handleShow(row)" class="table-inner-button">查看
              </el-button>
              <el-button type="primary" size="mini"
                         @click="handleUpdate(row)" class="table-inner-button">编辑
              </el-button>
              <el-button type="danger" size="mini"
                         @click="handleDeleteSingle(row)" class="table-inner-button">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="query.currentPage"
                    :limit.sync="query.pageSize" @pagination="doQueryList"/>
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
  </div>
</template>

<script>
import prdAdd from './add'
import prdEdit from './edit'
import prdShow from './show'
import prdImport from './import'
import prdApi from '@/api/prd/prd'
import Pagination from '@/components/Pagination/index'
import DevpTree from '@/components/DevpTree/index'
import projectApi from '@/api/project'

export default {
  name: 'PrdTable',
  components: {
    Pagination,
    DevpTree,
    prdAdd,
    prdEdit,
    prdShow,
    prdImport
  },
  data () {
    return {
      selectedNode: null,
      treeData: [{
        id: '1',
        label: '一级 1',
        children: [{
          id: '1-1',
          label: '二级 1-1',
          children: [{
            id: '1-1-1',
            label: '三级 1-1-1'
          }]
        }]
      }, {
        id: '2',
        label: '一级 2',
        children: [{
          id: '2-1',
          label: '二级 2-1',
          children: [{
            id: '2-1-1',
            label: '三级 2-1-1'
          }]
        }, {
          id: '2-2',
          label: '二级 2-2',
          children: [{
            id: '2-2-1',
            label: '三级 2-2-1'
          }]
        }]
      }, {
        id: '3',
        label: '一级 3',
        children: [{
          id: '3-1',
          label: '二级 3-1',
          children: [{
            id: '3-1-1',
            label: '三级 3-1-1'
          }]
        }, {
          id: '3-2',
          label: '二级 3-2',
          children: [{
            id: '3-2-1',
            label: '三级 3-2-1'
          }]
        }]
      }],
      value: null,
      projectList: [],
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
  created () {
    this.getProjectList()
    this.doQueryList({ currentPage: 1 })
  },
  methods: {
    appendNode () {
      console.log('appendNode', this.selectedNode)
      this.$refs.devpTree.addChild(this.selectedNode.id, {
        id: '10',
        label: '一级 1',
        children: [{
          label: '三级 3-2-1'
        }]
      })
    },
    treeSelectedNode (data) {
      console.log('data', data)
      this.selectedNode = data
    },
    getProjectList () {
      projectApi.getList()
        .then(data => {
          // 下载进度条数据初始化
          const projectList = []
          data.forEach(r => {
            var item = {}
            item.label = r.projectDesc
            item.value = r.projectId
            projectList.push(item)
          })
          this.projectList = projectList
        })
        .catch(error => this.$common.showNotifyError(error))
        .finally(() => { })
    },
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
