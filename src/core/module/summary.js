import Vue from 'vue'
import Command from '../core/command'
import Module from '../core/module'
import Minder from '../core/minder'

const kity = window.kity
const vue = new Vue()

const canAddSummary = {
  // 判断节点是否是同一层级
  isSameLevel: function (nodes) {
    const isLevel = new Set(Array.from(nodes, node => node.getLevel())).size === 1
    !isLevel && vue.$message.warning('请选择同一父级下同一层级节点')
    return !isLevel
  },
  // 判断节点父级是否是同一个
  isSameFather: function (nodes, list) {
    let isSameFather = true
    nodes.forEach(e => {
      list.push(e.getIndex())
      nodes[0].parent.getChildren().indexOf(e) === -1 && (isSameFather = false)
    })
    !isSameFather && vue.$message.warning('请选择同一父级下同一层级节点')
    return !isSameFather
  },
  // 判断是否已经存在概要
  isExistSummary: function (nodes, list) {
    let isExistSummary = false
    list = list.sort((a, b) => a - b)
    nodes[0].parent.getSummary()?.forEach(e => {
      e.data.startIndex === list[0] &&
        e.data.endIndex === list[list.length - 1] &&
        (isExistSummary = true)
    })
    return isExistSummary
  },
  // 判断是否是连续的
  // isContinuous: function (nodes, list, summaryNode) {
  //   summaryNode.splice()
  //   summaryNode.push(...nodes[0].parent.getChildren().slice(list[0], list[list.length - 1] + 1))
  //   summaryNode.length !== list.length && vue.$message.warning('请选择连续节点')
  //   return summaryNode.length !== list.length
  // },
  // 判断概要所包含的节点是否在同一边
  // isSameSide: function (summaryNode) {
  //   let sameSide = true
  //   summaryNode.forEach(e => e.side !== summaryNode[0].side && (sameSide = false))
  //   !sameSide && vue.$message.warning('请选择同边节点')
  //   return !sameSide
  // }
  // 判断节点中是否包含概要节点
  withoutSummaryNode: function (nodes) {
    return !nodes.some(e => e.type === 'summary')
  }
}
const getAnswer = function (key, ...args) {
  return canAddSummary[key](...args)
}
const dropList = (node, list) => {
  let start = 0,
    lastDropLList = []
  const children = node.parent.getChildren()
  for (let i = 1; i < list.length; i++) {
    if (
      list[i - 1] + 1 !== list[i] ||
      children[list[i - 1]].getData('side') !== children[list[i]].getData('side')
    ) {
      lastDropLList.push(list.slice(start, i))
      start = i
    }
  }
  lastDropLList.push(list.slice(start))
  return lastDropLList
}
/**
 * 新增概要命令
 * 判断是否可以新增概要的条件：选中的节点都是同一父级下的同一层级的普通节点且没有相同概要存在
 */
const AddSummaryCommand = kity.createClass('AddSummaryCommand', {
  base: Command,
  execute(km, text = '概要') {
    let list = []
    // summaryNode = []
    const nodes = km.getSelectedAncestors()
    if (
      getAnswer('isSameLevel', nodes) ||
      getAnswer('isSameFather', nodes, list) ||
      getAnswer('isExistSummary', nodes, list)
      // getAnswer('isContinuous', nodes, list, summaryNode) ||
      // getAnswer('isSameSide', summaryNode)
    )
      return
    dropList(nodes[0], list)?.forEach(e => {
      const parent = km.getSelectedNode().parent
      const summaryList = parent.getChildren().slice(e[0], e[e.length - 1] + 1)
      const summaryData = {
        startIndex: summaryList[0].getIndex(),
        // startId: summaryList[0].data.id,
        endIndex: summaryList[summaryList.length - 1].getIndex()
        // endId: summaryList[summaryList.length - 1].data.id
      }
      km.createNode(text, parent, parent.getSummary().length, 'summary', summaryData)
    })
    km.refresh()
    km.fire('textedit')
  },
  queryState(km) {
    const nodes = km.getSelectedAncestors()
    return (km.getSelectedNode() && km.getSelectedNode()?.parent && km.getAllNode().length) > 1 &&
      getAnswer('withoutSummaryNode', nodes)
      ? 0
      : -1
  }
})
kity.extendClass(Minder, {
  commonNodeMove(node, isDragTree = false) {
    const index = node.getIndex()
    const summary = node.parent.getSummary()
    for (let i = 0; i < summary.length; i++) {
      const e = summary[i]
      const startIndex = e.getData('startIndex')
      const endIndex = e.getData('endIndex')
      if (startIndex === endIndex && endIndex === index) {
        this.removeNode(e)
        i--
      } else if (startIndex <= index && index <= endIndex) {
        e.setData('endIndex', endIndex - 1)
      } else if (index < startIndex) {
        e.setData({
          startIndex: startIndex - 1,
          endIndex: endIndex - 1
        })
      }
      isDragTree && this.fire('contentchange')
    }
  },
  commonNodeAdd(node, index, isDragTree = false) {
    node.parent.getSummary().forEach(e => {
      const startIndex = e.getData('startIndex')
      const endIndex = e.getData('endIndex')
      if (startIndex < index && endIndex >= index) {
        e.setData('endIndex', endIndex + 1)
      } else if (index <= startIndex) {
        e.setData({
          startIndex: startIndex + 1,
          endIndex: endIndex + 1
        })
      }
      isDragTree && this.fire('contentchange')
    })
  }
})

Module.register('SummaryModule', function () {
  return {
    events: {
      beforremovechild(e) {
        const { node, isDragTree = false } = e
        node.type !== 'summary' && this.commonNodeMove(node, isDragTree)
      },
      nodeadd(e) {
        const { node, index, isDragTree } = e
        node.type !== 'summary' && this.commonNodeAdd(node, index, isDragTree)
      }
    },
    commands: {
      AddNodeSummary: AddSummaryCommand
    },

    commandShortcutKeys: {}
  }
})
