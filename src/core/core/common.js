import _ from 'lodash'
import utils from './utils'
import MinderNode from './node'

const kity = window.kity

kity.extendClass(MinderNode, {
  getChildren() {
    return this.children.common
  },
  /**
   * 判断节点是否叶子
   */
  isLeaf() {
    return this.getChildren().length === 0
  },
  /**
   * @returns 获取节点下标
   */
  getIndex() {
    return this.parent ? this.parent.getChildren().indexOf(this) : -1
  },
  getCopyIndex(id) {
    const node = _.find(this.getChildren(), e => {
      return e.getData('originId') === id
    })
    return node.getIndex()
  },
  clearChildren() {
    this.children.common = []
  },
  getChild(index) {
    return this.getChildren()[index]
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

  insertChild(node, index, fireSummaryChange = true, isDragTree = false) {
    if (index === undefined) {
      index = this.getChildren().length
    }
    if (node.parent) {
      node.parent.removeChild(node)
    }
    node.parent = this
    node.root = this.root
    if (fireSummaryChange) {
      this.getMinder().fire('nodeadd', { node, index, isDragTree })
    }
    this.getChildren().splice(index, 0, node)
  },
  appendChild(node) {
    return this.insertChild(node)
  },
  compareTo(node) {
    if (!utils.comparePlainObject(this.data, node.data)) return false
    if (!utils.comparePlainObject(this.temp, node.temp)) return false
    if (this.getChildren().length != node.getChildren().length) return false

    let i = 0
    while (this.getChild(i)) {
      if (!this.getChild(i).compareTo(node.getChild(i))) return false
      i++
    }

    return true
  }
})
