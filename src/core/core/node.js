import utils from './utils'
import Minder from './minder'
import { SummaryMinderNode, SummaryMinder } from './summary'
const kity = window.kity

/**
 * @class MinderNode
 *
 * 表示一个脑图节点
 */
const MinderNode = kity.createClass('MinderNode', {
  /**
   * 创建一个游离的脑图节点
   *
   * @param {String|Object} textOrData
   *     节点的初始数据或文本
   */
  constructor(textOrData, isFree = false) {
    // 指针
    this.parent = null
    this.root = this
    this.children = {
      common: [],
      summary: []
    }
    this.free = isFree

    // 数据
    this.data = {
      id: utils.guid(),
      created: +new Date()
    }

    // 绘图容器
    this.initContainers()

    if (utils.isString(textOrData)) {
      this.setText(textOrData)
    } else if (utils.isObject(textOrData)) {
      utils.extend(this.data, textOrData)
    }
  },

  initContainers() {
    this.rc = new kity.Group().setId(utils.uuid('minder_node'))
    this.rc.minderNode = this
  },

  /**
   * 判断节点是否根节点
   */
  isRoot() {
    return this.root === this
  },

  /**
   * 判断节点是否叶子
   */
  isLeaf() {
    return this.getChildren().length === 0
  },

  /**
   * 获取节点的根节点
   */
  getRoot() {
    return this.root || this
  },

  // 获取父级第

  /**
   * 获得节点的父节点
   */
  getParent() {
    return this.parent
  },

  getSiblings() {
    const children = this.parent.getChildren()
    const siblings = []
    const self = this
    children.forEach(function (child) {
      if (child !== self) siblings.push(child)
    })
    return siblings
  },

  getNodeByLevel(level = 0) {
    let ancestor = this
    while (ancestor && ancestor.getLevel() !== level) {
      ancestor = ancestor.parent
    }
    return ancestor ? ancestor : this
  },

  /**
   * 获得节点的深度
   */
  getLevel() {
    let level = 0
    let ancestor = this.parent
    while (ancestor) {
      level++
      ancestor = ancestor.parent
    }
    return level
  },

  /**
   * 获得节点的复杂度（即子树中节点的数量）
   */
  getComplex() {
    let complex = 0
    this.traverse(function () {
      complex++
    })
    return complex
  },

  /**
   * 获得节点的类型（root|main|sub）
   */
  getType() {
    this.type = this.data.type || ['root', 'main', 'sub'][Math.min(this.getLevel(), 2)]
    return this.type
  },
  /**
   * 针对一级节点，标识一级节点的左右布局
   */
  setPosition(p) {
    this.position = p
    return this
  },

  /**
   * 判断当前节点是否被测试节点的祖先
   * @param  {MinderNode}  test 被测试的节点
   */
  isAncestorOf(test) {
    let ancestor = test.parent
    while (ancestor) {
      if (ancestor === this) return true
      ancestor = ancestor.parent
    }
    return false
  },

  getData(key) {
    return key ? this.data[key] : this.data
  },

  setData(key, value) {
    if (typeof key === 'object') {
      const data = key
      for (key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          this.data[key] = data[key]
        }
      }
    } else {
      this.data[key] = value
    }
    return this
  },

  /**
   * 设置节点的文本数据
   * @param {String} text 文本数据
   */
  setText(text) {
    return (this.data.text = text)
  },

  /**
   * 获取节点的文本数据
   * @return {String}
   */
  getText() {
    return this.data.text || null
  },

  /**
   * 先序遍历当前节点树
   * @param  {Function} fn 遍历函数
   */
  preTraverse(fn, excludeThis) {
    let children = this.getChildren()
    if (!excludeThis) fn(this)
    for (let i = 0; i < children.length; i++) {
      children[i].preTraverse(fn)
    }
  },

  /**
   * 后序遍历当前节点树
   * @param  {Function} fn 遍历函数
   */
  postTraverse(fn, excludeThis) {
    const children = [...this.getChildren(), ...this.getSummary()]
    for (let i = 0; i < children.length; i++) {
      children[i].postTraverse(fn)
    }
    if (!excludeThis) fn(this)
  },

  traverse(fn, excludeThis) {
    return this.postTraverse(fn, excludeThis)
  },

  getChildren() {
    return this.children.common
  },

  getIndex() {
    return this.parent ? this.parent.getChildren().indexOf(this) : -1
  },

  insertChild(node, index) {
    if (index === undefined) {
      index = this.getChildren().length
    }
    if (node.parent) {
      node.parent.removeChild(node)
    }
    node.parent = this
    node.root = this.root

    this.getChildren().splice(index, 0, node)
  },

  appendChild(node) {
    return this.insertChild(node)
  },

  prependChild(node) {
    return this.insertChild(node, 0)
  },

  removeChild(elem) {
    let removed, commonIndex, summaryIndex
    if (elem instanceof MinderNode) {
      commonIndex = this.getChildren().indexOf(elem)
      summaryIndex = this.getSummary().indexOf(elem)
    }
    if (commonIndex !== -1 || summaryIndex !== -1) {
      removed =
        commonIndex !== -1
          ? this.getChildren().splice(commonIndex, 1)[0]
          : this.getSummary().splice(summaryIndex, 1)[0]
      removed.parent = null
      removed.root = removed
    }
  },

  clearChildren() {
    this.children.common = []
  },

  getChild(index) {
    return this.getChildren()[index]
  },

  getRenderContainer() {
    return this.rc
  },

  getCommonAncestor(node) {
    return MinderNode.getCommonAncestor(this, node)
  },

  contains(node) {
    return this === node || this.isAncestorOf(node)
  },

  clone() {
    const cloned = new MinderNode()

    cloned.data = utils.clone(this.data)
    cloned.data.id = utils.guid()
    cloned.data.created = +new Date()

    this.getChildren().forEach(function (child) {
      cloned.appendChild(child.clone())
    })

    return cloned
  },

  compareTo(node) {
    if (!utils.comparePlainObject(this.data, node.data)) return false
    if (!utils.comparePlainObject(this.temp, node.temp)) return false
    if (this.children.length != node.children.common.length) return false

    let i = 0
    while (this.getChild(i)) {
      if (!this.getChild(i).compareTo(node.children.common[i])) return false
      i++
    }

    return true
  },

  getMinder() {
    return this.getRoot().minder
  },
  ...SummaryMinderNode
})

MinderNode.getCommonAncestor = function (nodeA, nodeB) {
  if (nodeA instanceof Array) {
    return MinderNode.getCommonAncestor.apply(this, nodeA)
  }
  switch (arguments.length) {
    case 1:
      return nodeA.parent || nodeA

    case 2:
      if (nodeA.isAncestorOf(nodeB)) {
        return nodeA
      }
      if (nodeB.isAncestorOf(nodeA)) {
        return nodeB
      }
      var ancestor = nodeA.parent
      while (ancestor && !ancestor.isAncestorOf(nodeB)) {
        ancestor = ancestor.parent
      }
      return ancestor

    default:
      return Array.prototype.reduce.call(
        arguments,
        function (prev, current) {
          return MinderNode.getCommonAncestor(prev, current)
        },
        nodeA
      )
  }
}

kity.extendClass(Minder, {
  // getFreedom() {},

  // setFreedom() {},

  // 获取根节点
  getRoot() {
    return this._root
  },

  setRoot(root) {
    this._root = root
    root.minder = this
  },

  getAllNode() {
    const nodes = []
    this.getRoot().traverse(function (node) {
      nodes.push(node)
    })
    return nodes
  },

  getNodeById(id) {
    return this.getNodesById([id])[0]
  },

  getNodesById(ids) {
    const nodes = this.getAllNode()
    const result = []
    nodes.forEach(node => {
      if (ids.indexOf(node.getData('id')) !== -1) {
        result.push(node)
      }
    })
    return result
  },
  getNodesByKey(key) {
    const nodes = this.getAllNode()
    const result = []
    nodes.forEach(node => {
      if (node.getData('text').includes(key)) {
        result.push(node)
      }
    })
    return result
  },

  createFreedomNode(textOrData) {
    const isFree = true
    const node = new MinderNode(textOrData, isFree)
    const parent = this.getRoot()
    this.fire('nodecreate', {
      node,
      parent
    })
    parent.insertChild(node)
    const rc = this.getRenderContainer()
    node.traverse(function (current) {
      current.attached = true
      rc.addShape(current.getRenderContainer())
    })
    rc.addShape(node.getRenderContainer())
    return node
  },

  createNode(textOrData, parent, index, type = null, summaryData = {}) {
    const node = new MinderNode(textOrData)
    this.fire('nodecreate', {
      node: node,
      parent: parent,
      index: index
    })
    this.appendNode(node, parent, index, type, summaryData)
    return node
  },

  appendNode(node, parent, index, type, summaryData) {
    if (type) {
      parent && parent.insertSumChild(node, index)
      // 配置概要节点的数据结构
      const data = {
        type,
        ...summaryData
      }
      node.setData(data)
      this.attachNode(node)
    } else {
      parent && parent.insertChild(node, index)
      this.attachNode(node, type)
    }
    return this
  },

  removeNode(node) {
    if (node.parent) {
      node.parent.removeChild(node)
      this.detachNode(node)
      this.fire('noderemove', {
        node: node
      })
    }
  },

  attachNode(node) {
    const rc = this.getRenderContainer()
    node.traverse(function (current) {
      current.attached = true
      rc.addShape(current.getRenderContainer())
    })
    rc.addShape(node.getRenderContainer())
    this.fire('nodeattach', {
      node: node
    })
  },

  detachNode(node) {
    const rc = this.getRenderContainer()
    node.traverse(function (current) {
      current.attached = false
      rc.removeShape(current.getRenderContainer())
    })
    this.fire('nodedetach', {
      node: node
    })
  },

  getMinderTitle() {
    return this.getRoot().getText()
  },
  ...SummaryMinder
})

export default MinderNode
