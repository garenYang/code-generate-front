<template>
  <div class="app-container">
<!--    <div class="filter-container">-->
<!--      <el-input v-model="query.projectGroupName" placeholder="立项项目名称"-->
<!--                style="width: 200px;" class="filter-item"-->
<!--                @keyup.enter.native="handleQuery"/>-->
<!--      <el-button class="filter-item" icon="el-icon-search" type="primary"-->
<!--                 @click="handleQuery">-->
<!--        搜索-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="success"-->
<!--                 icon="el-icon-edit" @click="handleCreate">-->
<!--        新建-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="danger"-->
<!--                 icon="el-icon-delete" @click="handleDeleteBatch">-->
<!--        删除-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" icon="el-icon-download" type="warning"-->
<!--                 @click="handleExport">-->
<!--        导出-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" icon="el-icon-upload2" type="success"-->
<!--                 @click="handleImport">-->
<!--        导入-->
<!--      </el-button>-->
<!--    </div>-->

    <el-table v-loading="listLoading" :data="list"
              highlight-current-row
              @current-change="handleCurrentChange"
              style="width: 100%;padding: 0;"
              :show-header="false"
              row-class-name="row-style"
              cell-class-name="cell-style"
              >
      <el-table-column >
        <template slot-scope="{row}">
          <span>{{ row.projectGroupName }}</span>
        </template>
      </el-table-column>
    </el-table>
<!--    prev, pager, next, jumper-->
    <pagination :small="true" v-show="total>0" :layout="'total,prev,slot,next'" :total="total" :page.sync="query.currentPage"
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
  name: 'ExportProjectGroupList',
  components: {
    Pagination,
    projectGroupAdd,
    projectGroupEdit,
    projectGroupShow,
    projectGroupImport
  },
  data () {
    return {
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
     * 左侧项目列表选中行
     */
    handleCurrentChange (val) {
      this.currentRow = val
      this.$emit('selectRow', this.currentRow)
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

  /**
   * 左侧项目列表 行高
   */
  .row-style{
    height: 50px;
  }
  .cell-style{
    padding: 0 10px !important;
  }

</style>
