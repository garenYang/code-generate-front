<template>
  <div class="functionList">
<!--    <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--      <el-breadcrumb-item>模块功能点</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->

    <div class="filter-container">
      <el-row type="flex" align="middle" :gutter="20">
<!--        <el-col :span="6"  class="activeNum">-->
<!--          已选择{{ activeNum }}个功能点-->
<!--        </el-col>-->
        <el-col :span="24" style="text-align: right; margin-bottom: 10px;">
          <el-input v-model="query.status" placeholder="功能点开发状态"
                    style="width: 200px;margin-right:10px;" class="filter-item"
                    @keyup.enter.native="handleQuery"/>
          <el-button class="filter-item" icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">新建</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="handleDeleteBatch">删除</el-button>
          <el-button class="filter-item" icon="el-icon-download" type="warning" @click="handleExport">导出</el-button>
          <el-button class="filter-item" icon="el-icon-upload2" type="success" @click="handleImport">导入</el-button>
        </el-col>
      </el-row>

    </div>

<!--    <el-table v-loading="listLoading" :data="list"-->
<!--              @selection-change="selectionChange"-->
<!--              @sort-change="sortChange"-->
<!--              border stripe style="width: 100%;">-->
<!--      <el-table-column type="selection" width="50" />-->
<!--      <el-table-column label="主键"-->
<!--                       prop="id"-->
<!--                       align="center" width="100">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.id }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="功能名称"-->
<!--                       prop="functionName"-->
<!--                       align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.functionName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="功能点开发状态"-->
<!--                       prop="status"-->
<!--                       align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.status }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="创建时间"-->
<!--                       prop="createdTime"-->
<!--                       sortable="custom"-->
<!--                       align="center" width="200">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.createdTime }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="修改时间"-->
<!--                       prop="operatedTime"-->
<!--                       sortable="custom"-->
<!--                       align="center" width="200">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.operatedTime }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="操作" align="center" width="230">-->
<!--        <template slot-scope="{row}">-->
<!--          <el-button size="mini"-->
<!--                     @click="handleShow(row)" class="table-inner-button">查看</el-button>-->
<!--          <el-button type="primary" size="mini"-->
<!--                     @click="handleUpdate(row)" class="table-inner-button">编辑</el-button>-->
<!--          <el-button type="danger" size="mini"-->
<!--                     @click="handleDeleteSingle(row)" class="table-inner-button">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <pagination v-show="total>0" :total="total" :page.sync="query.page"-->
<!--                :limit.sync="query.limit" @pagination="doQueryList"/>-->
    <!-- 新建表单 -->
    <fsd-add ref="fsdAdd" @created="doQueryList({ page: 1 })"/>
    <!-- 编辑表单 -->
    <fsd-edit ref="fsdEdit" @updated="doQueryList({})"/>
    <!-- 查看表单 -->
    <fsd-show ref="fsdShow"/>
    <!-- 查看表单 -->
    <fsd-import ref="fsdImport" @imported="doQueryList({ page: 1 })"/>
  </div>
</template>

<script>
import fsdAdd from '../add'
import fsdEdit from '../edit'
import fsdShow from '../show'
import fsdImport from '../import'
import fsdApi from '@/api/fsd/fsd'
// import Pagination from '@/components/Pagination/index'

export default {
  name: 'DevpFsdList',
  components: {
    // Pagination,
    fsdAdd,
    fsdEdit,
    fsdShow,
    fsdImport
  },
  data () {
    return {
      activeNum: 0,
      list: [],
      total: 0,
      listLoading: true,
      query: {
        page: 1,
        limit: 10,
        status: null,
        createdTimeSortSign: 0,
        operatedTimeSortSign: 0
      },
      selectItems: []
    }
  },
  created () {
    this.doQueryList({ page: 1 })
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
      this.doQueryList({ page: 1 })
    },
    /**
     * 执行列表查询
     */
    doQueryList ({ page, limit }) {
      if (page) {
        this.query.page = page
      }
      if (limit) {
        this.query.limit = limit
      }
      this.listLoading = true
      return fsdApi.fetchList(this.query)
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
      if (this.activeNum <= 0) {
        this.$common.showMsg('warning', '请选择功能点！')
        return
      }
      return this.$common.confirm('是否确认删除')
        .then(() => fsdApi.deleteById(row.id))
        .then(() => {
          this.$common.showMsg('success', '删除成功')
          return this.doQueryList({ page: 1 })
        })
    },
    /**
     * 批量删除记录
     */
    handleDeleteBatch () {
      if (this.selectItems.length <= 0) {
        this.$common.showMsg('warning', '请选择模块功能点')
        return
      }
      return this.$common.confirm('是否确认删除')
        .then(() => fsdApi.deleteBatch(this.selectItems.map(row => row.id)))
        .then(() => {
          this.$common.showMsg('success', '删除成功')
          return this.doQueryList({ page: 1 })
        })
    },
    /**
     * 打开新建表单
     */
    handleCreate () {
      this.$refs.fsdAdd.handleCreate()
    },
    /**
     * 打开查看表单
     */
    handleShow (row) {
      this.$refs.fsdShow.handleShow(row.id)
    },
    /**
     * 打开编辑表单
     */
    handleUpdate (row) {
      this.$refs.fsdEdit.handleUpdate(row.id)
    },
    /**
     * 导出excel
     */
    handleExport () {
      return this.$common.confirm('是否确认导出')
        .then(() => fsdApi.exportExcel(this.query))
    },
    /**
     * 打开导入表单
     */
    handleImport () {
      this.$refs.fsdImport.show()
    }
  }
}
</script>

<style lang="scss">
  @import '../../../assets/common.scss';

  .functionList {
    .activeNum {
      min-width: 160px;
      text-align: left;
      padding: 0 0 0 20px;
    }
  }
  /** 调整表格行高 */
  .el-table td {
    padding: $el-table-padding;
  }
</style>
