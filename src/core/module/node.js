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
  execute: function (km, text) {
    const parent = km.getSelectedNode()
    if (!parent) {
      return null
    }
    const index = parent.getChildren().length + 1
    text = text + index.toString()
    const node = km.createNode(text, parent)
    km.select(node, true)
    if (parent.isExpanded()) {
      node.render()
    } else {
      parent.expand()
      parent.renderTree()
    }
    km.layout(600)
  },
  queryState: function (km) {
    const { 0: selectedNode, length } = km.getSelectedNodes() || []
    if (length > 1) return -1
    return selectedNode ? 0 : -1
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
  execute: function (km, text) {
    const sibling = km.getSelectedNode()
    const parent = sibling.parent
    const siblingIndex = sibling.getIndex()
    const index = !parent ? 1 : siblingIndex + 2
    text = text + index.toString()
    if (!parent) {
      return km.execCommand('AppendChildNode', text)
    }
    const node = km.createNode(text, parent, siblingIndex + 1)
    node.setGlobalLayoutTransform(sibling.getGlobalLayoutTransform())
    km.select(node, true)
    node.render()
    km.layout(600)
  },
  queryState: function (km) {
    const { 0: selectedNode, length } = km.getSelectedNodes() || []
    if ((selectedNode && selectedNode.isRoot()) || length > 1) return -1
    return selectedNode ? 0 : -1
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
  execute: function (km) {
    const nodes = km.getSelectedNodes().filter(node => !node.isRoot())
    console.log('nodes: ', nodes);
    const ancestor = MinderNode.getCommonAncestor.apply(null, nodes)
    const index = nodes[0].getIndex()

    
    nodes.forEach(function (node) {
      if (!node.isRoot()) km.removeNode(node)
    })
    if (nodes.length === 1) {
      const selectBack = ancestor.children[index - 1] || ancestor.children[index]
      km.select(selectBack || ancestor || km.getRoot(), true)
    } else {
      km.select(ancestor || km.getRoot(), true)
    }
    km.layout(600)
  },
  queryState: function (km) {
    const selectedNode = km.getSelectedNode()
    return selectedNode && !selectedNode.isRoot() ? 0 : -1
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
  execute: function (km, text) {
    const nodes = km.getSelectedNodes()

    nodes.sort(function (a, b) {
      return a.getIndex() - b.getIndex()
    })
    const parent = nodes[0].parent

    const newParent = km.createNode(text, parent, nodes[0].getIndex())
    nodes.forEach(function (node) {
      newParent.appendChild(node)
    })
    newParent.setGlobalLayoutTransform(nodes[nodes.length >> 1].getGlobalLayoutTransform())

    km.select(newParent, true)
    km.layout(600)
  },
  queryState: function (km) {
    const nodes = km.getSelectedNodes()
    if (!nodes.length) return -1
    const parent = nodes[0].parent
    if (!parent) return -1
    for (let i = 1; i < nodes.length; i++) {
      if (nodes[i].parent !== parent) return -1
    }
    return 0
  }
})

Module.register('NodeModule', function () {
  return {
    commands: {
      AppendChildNode: AppendChildCommand,
      AppendSiblingNode: AppendSiblingCommand,
      RemoveNode: RemoveNodeCommand,
      AppendParentNode: AppendParentCommand
    },

    commandShortcutKeys: {
      appendsiblingnode: 'normal::Enter',
      appendchildnode: 'normal::Insert|Tab',
      appendparentnode: 'normal::Shift+Tab|normal::Shift+Insert',
      removenode: 'normal::Del|Backspace'
    }
  }
})
