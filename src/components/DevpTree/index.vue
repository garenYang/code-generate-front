<template>
  <div>
    <el-tree
      ref="tree"
      :data="data"
      :node-key="nodeKey"
      :props="defaultProps"
      highlight-current
      :expand-on-click-node="expand"
      :default-expanded-keys="expandKeys"
      :current-node-key="selectedKey"
      @node-click="handleNodeClick"
      @node-expand="nodeExpand"
      @node-collapse="nodeCollapse"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: 'devp-tree',
  props: {
    data: Array,
    nodeKey: {
      type: String,
      default: 'id'
    },
    expand: {
      type: Boolean,
      default: false
    },
    selectedKey: {
      // 设置选中的key
      type: String
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectedNode: null,
      expandKeys: []
    }
  },
  methods: {
    setCurrentKey (key) {
      console.log(key)
      this.$refs.tree.setCurrentKey(key)
    },
    addExpandKeys (key) {
      // 添加需要打开的ID
      this.expandKeys.push(key)
    },
    nodeExpand (data, node, event) {
      // 展开的id
      this.expandKeys.push(data.id)
    },
    nodeCollapse (data, node, event) {
      // 删除关闭的ID
      this.expandKeys.splice(this.expandKeys.indexOf(data.id), 1)
    },
    handleNodeClick (node) {
      console.log(node)
      this.selectedNode = node
      // this.selectdNode = data.label
      this.$emit('selectNode', node)
    },
    parentData (data) {
      console.log(data)
    },
    /**
     * 为根据节点id添加子节点
     * @param id
     * @param data
     */
    addChild (id, data) {
      console.log('appendNode', this.$refs.tree.getNode(id))
      const node = this.$refs.tree.getNode(id)
      this.$refs.tree.append(data, node)
    }
  }
}
</script>
