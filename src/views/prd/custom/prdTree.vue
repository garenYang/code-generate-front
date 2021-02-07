<template>
  <div class="prdTree">
    <devp-tree ref="devpTree"
               @selectNode="treeSelectedNode"
               :data.sync="treeData"
    ></devp-tree>
  </div>
</template>

<script>
// import prdApi from '@/api/prd/prd'
import DevpTree from '@/components/DevpTree/index'
import prdApi from '@/api/prd/prd'
// import projectApi from '@/api/project'

export default {
  name: 'PrdTree',
  components: {
    DevpTree
  },
  data () {
    return {
      selectedKey: null,
      selectedNode: null,
      treeData: [],
      query: {
        currentPage: 1,
        pageSize: 10,
        projectId: null,
        title: '',
        createdTimeSortSign: 0,
        operatedTimeSortSign: 0
      }
    }
  },
  created () {
  },
  methods: {
    getTree (projectGroupId) {
      // 查询需求树
      return prdApi.getTree(projectGroupId).then(data => {
        console.log('getTree', data)
        this.treeData = data
        return this.treeData
      })
    },
    treeSelectedNode (data) {
      console.log('treeSelectedNode', data)
      // 从数据库中获取节点的详细数据
      prdApi.fetchById(data.id).then(data => {
        this.selectedNode = data
        this.$emit('treeSelectedNode', data)
      })
    },
    treeSelectedNodeById (id) {
      // 从数据库中获取节点的详细数据
      prdApi.fetchById(id).then(data => {
        this.selectedNode = data
        this.$emit('treeSelectedNode', data)
      })
    },
    // 设置节点的选中状态
    setSelectNode (id) {
      this.$refs.devpTree.setCurrentKey(id)
      this.treeSelectedNodeById(id)
    },
    // 创建顶级需求节点
    doCreate (form) {
      console.log('doCreate', form)
      let newNodeKey = null
      prdApi.create(form)
        .then(data => {
          console.log('addExpandKeys', data)
          // 新增子节点后 展开父节点
          if (data.parentId !== '-1') {
            this.$refs.devpTree.addExpandKeys(data.id)
          }
          newNodeKey = data.id
          this.formVisible = false
          this.$common.showMsg('success', '节点创建成功')
          return this.getTree(form.projectGroupId)
        })
        .then(() => {
          if (newNodeKey) {
            // 设置选中节点
            this.setSelectNode(newNodeKey)
          }
        })
    },
    /**
     * 删除单条记录
     */
    handleDeleteSingle (row) {
      return this.$common.confirm('是否确认删除')
        .then(() => prdApi.deleteById(row.id))
        .then(data => {
          this.$common.showMsg('success', '删除成功')
          return this.getTree(row.projectGroupId)
        }).then(() => {
          // 当前节点被删除 设置父节点的选中状态
          this.setSelectNode(row.parentId)
        })
    },
    /**
     * 执行修改操作
     */
    doUpdate (form) {
      console.log('doUpdate', form)
      prdApi.update(form)
        .then(data => {
          this.formVisible = false
          this.$common.showMsg('success', '修改成功')
          this.$emit('updated', data)
          this.getTree(form.projectGroupId)
        })
    }
  }
}
</script>

<style lang="scss">

</style>
