<template>
  <div class="requirementsList">

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>需求文档管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row type="flex" align="middle" :gutter="20" style="padding:10px 0;">
      <el-col :span="6" class="activeNum">
        已选择{{ this.activeNum }}个需求文档
      </el-col>
      <el-col :span="18" style="text-align: right;">
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">新建</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="handleDeleteBatch">删除</el-button>
        <el-button class="filter-item" icon="el-icon-download" type="warning" @click="handleExport">导出</el-button>
        <el-button class="filter-item" icon="el-icon-upload2" type="success" @click="handleImport">导入</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="list" @selection-change="selectionChange" border stripe style="width: 100%;">
      <el-table-column type="selection" width="50" />
      <el-table-column label="主键" prop="id" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column property="project" label="项目名称"></el-table-column>
      <el-table-column property="title" label="需求文档名称"></el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleShow(row)" class="table-inner-button">查看</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)" class="table-inner-button">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDeleteSingle(row)" class="table-inner-button">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page"
                :limit.sync="query.limit" @pagination="doQueryList"/>
    <!-- 新建表单 -->
    <demands-add ref="demandsAdd" @created="doQueryList({ page: 1 })"/>
    <!-- 编辑表单 -->
    <demands-edit ref="demandsEdit" @updated="doQueryList({})"/>
    <!-- 查看表单 -->
    <demands-show ref="demandsShow"/>
    <!-- 查看表单 -->
    <demands-import ref="demandsImport" @imported="doQueryList({ page: 1 })"/>
  </div>
</template>

<script>
import demandsAdd from './add'
import demandsEdit from './edit'
import demandsShow from './show'
import demandsImport from './import'
import demandsApi from '@/api/demands'
import Pagination from '@/components/Pagination'

export default {
  name: 'DemandsTable',
  components: {
    Pagination,
    demandsAdd,
    demandsEdit,
    demandsShow,
    demandsImport
  },
  data () {
    return {
      activeNum: 0,
      list: [],
      total: 0,
      listLoading: true,
      query: {
        page: 1,
        limit: 10
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
      return demandsApi.fetchList(this.query)
        .then(data => {
          console.log(data)
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
      return this.$common.confirm('是否确认删除？')
        .then(() => demandsApi.deleteById(row.id))
        .then(() => {
          this.$common.showMsg('success', '删除成功！')
          return this.doQueryList({ page: 1 })
        })
    },
    /**
     * 批量删除记录
     */
    handleDeleteBatch () {
      if (this.selectItems.length <= 0) {
        this.$common.showMsg('warning', '请选择需求文档列表！')
        return
      }
      return this.$common.confirm('是否确认删除？')
        .then(() => demandsApi.deleteBatch(this.selectItems.map(row => row.id)))
        .then(() => {
          this.$common.showMsg('success', '删除成功！')
          return this.doQueryList({ page: 1 })
        })
    },
    /**
     * 打开新建表单
     */
    handleCreate () {
      this.$refs.demandsAdd.handleCreate()
    },
    /**
     * 打开查看表单
     */
    handleShow (row) {
      this.$refs.demandsShow.handleShow(row.id)
    },
    /**
     * 打开编辑表单
     */
    handleUpdate (row) {
      this.$refs.demandsEdit.handleUpdate(row.id)
    },
    /**
     * 导出excel
     */
    handleExport () {
      return this.$common.confirm('是否确认导出')
        .then(() => demandsApi.exportExcel(this.query))
    },
    /**
     * 打开导入表单
     */
    handleImport () {
      this.$refs.demandsImport.show()
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/common.scss';

  .requirementsList {
    .activeNum {
      min-width: 160px;
      text-align: left;
      padding: 0 0 0 20px;
    }
  }
</style>
