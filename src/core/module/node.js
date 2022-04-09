import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity
/**
 * @command AppendChildNode
 * @description 添加子节点到选中的节点中
 * @param {string|object} textOrData 要插入的节点的文本或数据
 * @state
 *    0: 当前有选中的节点
 *   -1: 当前没有选中的节点
 */
const AppendChildCommand = kity.createClass('AppendChildCommand', {
  base: Command,
  execute(km, text = '分支主题') {
    const parents = km.getSelectedNodes() || []
    if (!parents.length) {
      return null
    }
    let lastNode = null
    for (let i = 0; i < parents.length; i++) {
      const parent = parents[i]
      const index = parent.getChildren().length + 1
      const node = km.createNode(text + ' ' + index.toString(), parent)
      lastNode = node
      if (!parent.isExpanded()) {
        parent.expand()
      }
    }
    km.select(lastNode, true)
    km.refresh()
    km.fire('textedit')
  },
  queryState(km) {
    return km.getSelectedNode() ? 0 : -1
  }
})

/**
 * @command AppendSiblingNode
 * @description 添加选中的节点的兄弟节点
 * @param {string|object} textOrData 要添加的节点的文本或数据
 * @state
 *    0: 当前有选中的节点
 *   -1: 当前没有选中的节点
 */
const AppendSiblingCommand = kity.createClass('AppendSiblingCommand', {
  base: Command,
  execute(km, text = '分支主题') {
    const sibling = km.getSelectedNode()
    const parent = sibling.parent
    const siblingIndex = sibling.getIndex()

    if (!parent) {
      return km.execCommand('AppendChildNode', text)
    }

    const index = parent.getChildren().length + 1

    const node = km.createNode(text + ' ' + index.toString(), parent, siblingIndex + 1)

    node.render()

    km.select(node, true)
    km.layout(600)
    km.fire('textedit')
  },
  queryState(km) {
    return km.getSelectedNode() ? 0 : -1
  }
})

/**
 * @command AppendParent
 * @description 添加父级节点
 * @state
 *    0: 当前有选中的节点
 *   -1: 当前没有选中的节点
 */
const AppendParentCommand = kity.createClass('AppendParentCommand', {
  base: Command,
  execute(km, text = '分支主题') {
    const nodes = (km.getSelectedNodes() || []).filter(node => !node.isRoot())

    nodes.sort((a, b) => a.getIndex() - b.getIndex())
    const ancestor = MinderNode.getCommonAncestor.apply(null, nodes)
    const children = ancestor.getChildren() || []
    const index = children.length + 1
    const newParent = km.createNode(text + ' ' + index.toString(), ancestor, ancestor.getIndex())
    nodes.forEach(node => newParent.appendChild(node))
    newParent.setGlobalLayoutTransform(nodes[nodes.length >> 1].getGlobalLayoutTransform())

    km.select(newParent, true)
    km.layout(600)
    km.fire('textedit')
  },
  queryState(km) {
    const nodes = km.getSelectedNodes()
    if (!nodes.length) return -1
    const nodesNoRoot = nodes.filter(node => !node.isRoot())
    const ancestor = MinderNode.getCommonAncestor.apply(null, nodesNoRoot)
    return !ancestor ? -1 : 0
  }
})

/**
 * @command RemoveNode
 * @description 移除选中的节点
 * @state
 *    0: 当前有选中的节点
 *   -1: 当前没有选中的节点
 */
const RemoveNodeCommand = kity.createClass('RemoverNodeCommand', {
  base: Command,
  execute(km) {
    const nodes = km.getSelectedNodes().filter(node => !node.isRoot())
    const ancestor = MinderNode.getCommonAncestor.apply(null, nodes)

    nodes.forEach(node => {
      if (!node.isRoot()) km.removeNode(node)
    })
    if (nodes.length === 1) {
      const index = nodes[0].getIndex()
      const selectBack = ancestor.children[index - 1] || ancestor.children[index]
      km.select(selectBack || ancestor || km.getRoot(), true)
    } else {
      km.select(ancestor || km.getRoot(), true)
    }
    km.refresh()
  },
  queryState(km) {
    const selectedNode = km.getSelectedNode()
    return selectedNode ? 0 : -1
  }
})

/**
 * @command RemoveCurrentNode
 * @description 移除选中的当前节点
 * @state
 *    0: 当前有选中的节点
 *   -1: 当前没有选中的节点
 */

const RemoveCurrentNodeCommand = kity.createClass('RemoveCurrentNodeCommand', {
  base: Command,
  execute: function (km) {
    const nodes = km.getSelectedNodes().filter(node => !node.isRoot())
    const ancestor = MinderNode.getCommonAncestor.apply(null, nodes)

    nodes.forEach(function (node) {
      node
        .getChildren()
        .slice()
        .forEach(sub => ancestor.appendChild(sub))
      km.removeNode(node)
    })
    if (nodes.length === 1) {
      const index = nodes[0].getIndex()
      const selectBack = ancestor.children[index - 1] || ancestor.children[index]
      km.select(selectBack || ancestor || km.getRoot(), true)
    } else {
      km.select(ancestor || km.getRoot(), true)
    }
    km.refresh()
  },
  queryState: function (km) {
    const selectedNode = km.getSelectedNode()
    return selectedNode && !selectedNode.isRoot() ? 0 : -1
  }
})

Module.register('NodeModule', function () {
  return {
    commands: {
      AppendChildNode: AppendChildCommand,
      AppendSiblingNode: AppendSiblingCommand,
      RemoveNode: RemoveNodeCommand,
      RemoveCurrentNode: RemoveCurrentNodeCommand,
      AppendParentNode: AppendParentCommand
    },

    commandShortcutKeys: {
      appendsiblingnode: 'normal::enter',
      appendchildnode: 'normal::ins|normal::tab',
      appendparentnode: 'normal::shift+tab|normal::shift+ins',
      removenode: 'normal::del|normal::backspace',
      removeCurrentNode:
        'normal::ctrl+del|normal::ctrl+backspace|normal::command+del|normal::command+backspace'
    }
  }
})
