import MinderNode from './node'

const kity = window.kity

/**
 * 概要节点方法，大致与普通节点相同
 * 防止过度耦合
 */
kity.extendClass(MinderNode, {
  getSummary() {
    return this.children.summary
  },
  getSumIndex() {
    return this.parent ? this.parent.getSummary().indexOf(this) : -1
  },
  getSumByIdx(index) {
    return this.getSummary()[index]
  },
  /**
   *  yanyana
   *  新建概要节点
   * @param {*} node  MinderNode
   * @param {*} index 新建概要节点的下标
   */
  insertSumChild(node, index) {
    if (index === undefined) {
      index = this.getSummary().length
    }
    if (node.parent) {
      node.parent.removeSumChild(node)
    }
    node.parent = this
    node.root = this.root

    this.getSummary().splice(index, 0, node)
  },
  removeSumChild(elem) {
    let index = elem
    let removed
    if (elem instanceof MinderNode) {
      index = this.getSummary().indexOf(elem)
    }
    if (index >= 0) {
      removed = this.getSummary().splice(index, 1)[0]
      removed.parent = null
      removed.root = removed
    }
  },
  /**
   * 后序遍历当前节点树
   * @param  {Function} fn 遍历函数
   */
  getSummaryByFloor(arr) {
    arr.push(...this.getSummary())
    const children = this.getChildren()
    for (let i = 0; i < children.length; i++) {
      children[i].getSummaryByFloor(arr)
    }
    return arr
  },

  getAllSummary() {
    return this.getSummaryByFloor([])
  }
})
