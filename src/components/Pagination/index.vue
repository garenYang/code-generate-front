<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      :small="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <span>
        <input style="width: 30px; text-align: center" v-model="ownCurrentPage"
               @change="setCurrentPage(ownCurrentPage)" /> / {{ Math.ceil(total/limit) }}
      </span>
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

/**
 * 如果空间很小也需要展示分页功能，可以使用
 * :layout="'total,prev,slot,next'"
 * 展示结果如下 slot自定义了 span/input
 * 共 13 条  < 1 / 2 >
 */
export default {
  name: 'Pagination',
  props: {
    small: {
      type: Boolean,
      default: false
    },
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ownCurrentPage: 0
    }
  },
  computed: {
    currentPage: {
      get () {
        return this.page
      },
      set (val) {
        this.ownCurrentPage = val
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get () {
        return this.limit
      },
      set (val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    setCurrentPage (val) {
      const valNumber = Number(val)
      if (typeof valNumber === 'number' &&
        !isNaN(valNumber) &&
        this.ownCurrentPage !== this.currentPage &&
        valNumber > 0 &&
        valNumber <= Math.ceil(this.total / this.limit)
      ) {
        this.currentPage = valNumber
        this.handleCurrentChange(this.currentPage)
      } else {
        this.ownCurrentPage = this.currentPage
      }
    },
    handleSizeChange (val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange (val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
