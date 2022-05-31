import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

kity.extendClass(MinderNode, {
  arrange(index) {
    const parent = this.parent
    if (!parent) return
    const sibling = parent.getChildren()

    if (index < 0 || index >= sibling.length) return
    // 节点变化触发概要变化
    // 先出发节点的删除，再触发节点的新增
    // this.getMinder().fire('noderemove', { node: this })
    // this.getMinder().fire('nodeadd', { node: this, index })
    sibling.splice(this.getIndex(), 1)
    sibling.splice(index, 0, this)
    return this
  }
})

function asc(nodeA, nodeB) {
  return nodeA.getIndex() - nodeB.getIndex()
}
function desc(nodeA, nodeB) {
  return -asc(nodeA, nodeB)
}

// function canArrange(km) {
//   var selected = km.getSelectedNode()
//   return selected && selected.parent && selected.parent.children.length > 1
// }

/**
 * @command ArrangeUp
 * @description 向上调整选中节点的位置
 * @shortcut Alt + up
 * @state
 *    0: 当前选中了具有相同父亲的节点
 *   -1: 其它情况
 */
const ArrangeUpCommand = kity.createClass('ArrangeUpCommand', {
  base: Command,

  execute(km) {
    const nodes = km.getSelectedNodes()
    nodes.sort(asc)
    const lastIndexes = nodes.map(function (node) {
      return node.getIndex()
    })
    nodes.forEach(function (node, index) {
      node.arrange(lastIndexes[index] - 1)
    })
    km.layout(300)
  },

  queryState(km) {
    const selected = km.getSelectedNode()
    return selected ? 0 : -1
  }
})

/**
 * @command ArrangeDown
 * @description 向下调整选中节点的位置
 * @shortcut Alt + down
 * @state
 *    0: 当前选中了具有相同父亲的节点
 *   -1: 其它情况
 */
const ArrangeDownCommand = kity.createClass('ArrangeUpCommand', {
  base: Command,

  execute(km) {
    const nodes = km.getSelectedNodes()
    nodes.sort(desc)
    const lastIndexes = nodes.map(function (node) {
      return node.getIndex()
    })
    nodes.forEach(function (node, index) {
      node.arrange(lastIndexes[index] + 1)
    })
    km.layout(300)
  },

  queryState(km) {
    const selected = km.getSelectedNode()
    return selected ? 0 : -1
  }
})

/**
 * @command Arrange
 * @description 调整选中节点的位置
 * @param {number} index 调整后节点的新位置
 * @state
 *    0: 当前选中了具有相同父亲的节点
 *   -1: 其它情况
 */
const ArrangeCommand = kity.createClass('ArrangeCommand', {
  base: Command,

  execute(km, index) {
    const nodes = km.getSelectedNodes().slice()

    if (!nodes.length) return

    const ancestor = MinderNode.getCommonAncestor(nodes)

    if (ancestor != nodes[0].parent) return

    const indexed = nodes.map(function (node) {
      return {
        index: node.getIndex(),
        node: node
      }
    })

    const asc =
      Math.min.apply(
        Math,
        indexed.map(function (one) {
          return one.index
        })
      ) >= index

    indexed.sort(function (a, b) {
      return asc ? b.index - a.index : a.index - b.index
    })

    indexed.forEach(function (one) {
      one.node.arrange(index)
    })

    km.layout(300)
  },

  queryState(km) {
    const selected = km.getSelectedNode()
    return selected ? 0 : -1
  }
})

Module.register('ArrangeModule', {
  commands: {
    arrangeup: ArrangeUpCommand,
    arrangedown: ArrangeDownCommand,
    arrange: ArrangeCommand
  },
  commandShortcutKeys: {
    arrangeup: 'normal::alt+up',
    arrangedown: 'normal::alt+down'
  }
})
