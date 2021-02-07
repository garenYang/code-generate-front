<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="filter-container">
      <el-row type="flex" align="middle" :gutter="20">
        <el-col :span="6"  class="activeNum">
          已选择{{ activeNum }}个项目
        </el-col>
        <el-col :span="18" style="text-align: right; margin-bottom: 10px;">
          <el-input v-model="query.projectGroupName" placeholder="立项项目名称"
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
      <el-table-column type="selection" width="50" />
      <el-table-column label="主键"
                       prop="id"
                       align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="立项项目名称"
                       prop="projectGroupName"
                       sortable="custom"
                       align="center">
        <template slot-scope="{row}">
          <span>{{ row.projectGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号"
                       prop="orderNo"
                       sortable="custom"
                       align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.orderNo }}</span>
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
                     @click="handleShow(row)" class="table-inner-button">查看</el-button>
          <el-button type="primary" size="mini"
                     @click="handleUpdate(row)" class="table-inner-button">编辑</el-button>
          <el-button type="text" size="medium"
                     @click="handleDeleteSingle(row)" class="table-inner-button">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.currentPage"
                :limit.sync="query.pageSize" @pagination="doQueryList"/>
    <!-- 新建表单 -->
    <projectGroup-add ref="projectGroupAdd" @created="doQueryList({ currentPage: 1 })"/>
    <!-- 编辑表单 -->
    <projectGroup-edit ref="projectGroupEdit" @updated="doQueryList({})"/>
    <!-- 查看表单 -->
    <projectGroup-show ref="projectGroupShow"/>
    <!-- 查看表单 -->
    <projectGroup-import ref="projectGroupImport" @imported="doQueryList({ currentPage: 1 })"/>
  </div>
</template>

<script>
import projectGroupAdd from './add'
import projectGroupEdit from './edit'
import projectGroupShow from './show'
import projectGroupImport from './import'
import projectGroupApi from '@/api/projectgroup/projectGroup'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProjectGroupTable',
  components: {
    Pagination,
    projectGroupAdd,
    projectGroupEdit,
    projectGroupShow,
    projectGroupImport
  },
  data () {
    return {
      activeNum: 0,
      list: [],
      total: 0,
      listLoading: true,
      query: {
        currentPage: 1,
        pageSize: 10,
        projectGroupName: null,
        projectGroupNameSortSign: 0,
        orderNoSortSign: 0,
        createdTimeSortSign: 0,
        operatedTimeSortSign: 0
      },
      selectItems: []
    }
  },
  created () {
    this.doQueryList({ currentPage: 1 })
  },
  methods: {
    /**
     * 选择框变化
     */
    selectionChange (val) {
      this.selectItems = val
      this.activeNum = this.selectItems.length
    },
    /**
     * 触发后端排序
     */
    sortChange ({ prop, order }) {
      const sortKeyMap = {
        'projectGroupName': 'projectGroupNameSortSign',
        'orderNo': 'orderNoSortSign',
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
      return projectGroupApi.fetchList(this.query)
        .then(data => {
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
        .then(() => projectGroupApi.deleteById(row.id))
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
        this.$common.showMsg('warning', '请选择项目')
        return
      }
      return this.$common.confirm('是否确认删除')
        .then(() => projectGroupApi.deleteBatch(this.selectItems.map(row => row.id)))
        .then(() => {
          this.$common.showMsg('success', '删除成功')
          return this.doQueryList({ currentPage: 1 })
        })
    },
    /**
     * 打开新建表单
     */
    handleCreate () {
      this.$refs.projectGroupAdd.handleCreate()
    },
    /**
     * 打开查看表单
     */
    handleShow (row) {
      this.$refs.projectGroupShow.handleShow(row.id)
    },
    /**
     * 打开编辑表单
     */
    handleUpdate (row) {
      this.$refs.projectGroupEdit.handleUpdate(row.id)
    },
    /**
     * 导出excel
     */
    handleExport () {
      return this.$common.confirm('是否确认导出')
        .then(() => projectGroupApi.exportExcel(this.query))
    },
    /**
     * 打开导入表单
     */
    handleImport () {
      this.$refs.projectGroupImport.show()
    }
  }
}
</script>
<style lang="scss">
  @import '../../assets/common.scss';
  .projectGroupList{
    margin-bottom: 10px;
    .activeNum {
      min-width: 160px;
      padding: 0 0 0 20px;
      .num{
        padding: 0 10px;
        font-weight: bold;
      }
    }
  }
  /** 调整表格行高 */
  .el-table td {
    padding: $el-table-padding;
  }
</style>
