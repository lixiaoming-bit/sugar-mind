import utils from './utils'
import Minder from './minder'
import MinderNode from './node'
const kity = window.kity

Minder.registerInitHook(function () {
  this._initSelection()
})

// 选区管理
kity.extendClass(Minder, {
  _initSelection: function () {
    this._selectedNodes = []
  },
  renderChangedSelection: function (last) {
    const current = this.getSelectedNodes()
    const changed = []

    current.forEach(function (node) {
      if (last.indexOf(node) === -1) {
        changed.push(node)
      }
    })

    last.forEach(function (node) {
      if (current.indexOf(node) === -1) {
        changed.push(node)
      }
    })

    if (changed.length) {
      this._interactChange()
      this.fire('selectionchange')
    }
    while (changed.length) {
      changed.shift().render()
    }
  },
  getSelectedNodes: function () {
    //不能克隆返回，会对当前选区操作，从而影响querycommand
    return this._selectedNodes
  },
  getSelectedNode: function () {
    return this.getSelectedNodes()[0] || null
  },
  removeAllSelectedNodes: function () {
    const last = this._selectedNodes.splice(0)
    this._selectedNodes = []
    this.renderChangedSelection(last)
    return this.fire('selectionclear')
  },
  removeSelectedNodes: function (nodes) {
    const self = this
    const last = this._selectedNodes.slice(0)
    nodes = utils.isArray(nodes) ? nodes : [nodes]

    nodes.forEach(function (node) {
      let index
      if ((index = self._selectedNodes.indexOf(node)) === -1) return
      self._selectedNodes.splice(index, 1)
    })

    this.renderChangedSelection(last)
    return this
  },
  select: function (nodes, isSingleSelect) {
    const lastSelect = this.getSelectedNodes().slice(0)
    if (isSingleSelect) {
      this._selectedNodes = []
    }
    const self = this
    nodes = utils.isArray(nodes) ? nodes : [nodes]
    nodes.forEach(function (node) {
      if (self._selectedNodes.indexOf(node) !== -1) return
      self._selectedNodes.unshift(node)
    })
    this.renderChangedSelection(lastSelect)
    return this
  },
  selectById: function (ids, isSingleSelect) {
    ids = utils.isArray(ids) ? ids : [ids]
    const nodes = this.getNodesById(ids)
    return this.select(nodes, isSingleSelect)
  },
  //当前选区中的节点在给定的节点范围内的保留选中状态，
  //没在给定范围的取消选中，给定范围中的但没在当前选中范围的也做选中效果
  toggleSelect: function (node) {
    if (utils.isArray(node)) {
      node.forEach(this.toggleSelect.bind(this))
    } else {
      if (node.isSelected()) this.removeSelectedNodes(node)
      else this.select(node)
    }
    return this
  },

  isSingleSelect: function () {
    return this._selectedNodes.length === 1
  },

  getSelectedAncestors: function (includeRoot) {
    const nodes = this.getSelectedNodes().slice(0)
    const ancestors = []
    let judge

    // 根节点不参与计算
    const rootIndex = nodes.indexOf(this.getRoot())
    if (~rootIndex && !includeRoot) {
      nodes.splice(rootIndex, 1)
    }

    // 判断 nodes 列表中是否存在 judge 的祖先
    function hasAncestor(nodes, judge) {
      for (let i = nodes.length - 1; i >= 0; --i) {
        if (nodes[i].isAncestorOf(judge)) return true
      }
      return false
    }

    // 按照拓扑排序
    nodes.sort(function (node1, node2) {
      return node1.getLevel() - node2.getLevel()
    })

    // 因为是拓扑有序的，所以只需往上查找
    while ((judge = nodes.pop())) {
      if (!hasAncestor(nodes, judge)) {
        ancestors.push(judge)
      }
    }

    return ancestors
  }
})

kity.extendClass(MinderNode, {
  isSelected: function () {
    const minder = this.getMinder()
    return minder && minder.getSelectedNodes().indexOf(this) !== -1
  }
})
