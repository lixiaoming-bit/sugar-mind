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
  },
  /**
   * 判断节点是否在某个概要内
   * @param {*} node 需要判断的节点
   * @param {*} parent 节点的parent
   * @returns 包含节点的概要（是否包含可以判断summary的长度）
   */
  isInSummary(parent, idx) {
    const index = idx === undefined ? this.getIndex() : idx
    let list = []
    parent.getSummary().forEach(e => {
      const startIndex = e.getData('startIndex')
      const endIndex = e.getData('endIndex')
      if (startIndex <= index && index <= endIndex) {
        list.push(e)
      }
    })
    return list
  },
  longestSummary(list) {
    let max = list[0]
    let maxLength = list[0].endIndex - list[0].startIndex + 1
    list.forEach(e => {
      const length = e.endIndex - e.startIndex + 1
      if (length > maxLength) {
        max = e
        maxLength = length
      }
    })
    return {
      max,
      maxLength
    }
  },
  // 查找节点数组中包含概要的节点所对应的概要
  includeSummary(nodesList) {
    let partList = new Map()
    nodesList.forEach(e => {
      const key = e.parent?.getData('id') || 'root'
      partList.set(key, partList.has(key) ? [...partList.get(key), e] : [e])
    })
    let list = []
    for (const [key, value] of partList) {
      value[0]?.parent?.getSummary().forEach(e => {
        // 对应概要的起点和终点
        const startIndex = e.getData('startIndex')
        const endIndex = e.getData('endIndex')
        const children = value[0].parent.getChildren()
        for (let i = startIndex; i <= endIndex; i++) {
          if (value.indexOf(children[i]) === -1) break
          if (i === endIndex) {
            list.push({
              summary: e,
              parent: key,
              startNode: children[startIndex],
              endNode: children[endIndex]
            })
          }
        }
      })
    }
    return list
  },
  /**
   *
   * @param {开始计算的节点} node
   * @param {左边或者右边节点数组} list
   * @returns
   */
  getBindNode(node, list) {
    const summaryList = node.isInSummary(node.parent)
    let startSumSet = new Set(summaryList)
    let countList = list.slice(list.indexOf(node))
    let lastList = []
    for (let i = 0; i < countList.length; i++) {
      let e = countList[i]
      const summaryList1 = e.isInSummary(e.parent)
      let addSumSet = startSumSet
      let startSumSetLength = Array.from(startSumSet).length
      summaryList1.forEach(e => addSumSet.add(e))
      let addSumSetLength = Array.from(addSumSet).length
      if (summaryList1.length + startSumSetLength > addSumSetLength) {
        // 存在相同概要
        lastList.push(e)
        startSumSet = addSumSet
      } else {
        break
      }
    }
    return lastList
  }
})
