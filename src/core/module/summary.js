import Vue from 'vue'
import Command from '../core/command'
import Module from '../core/module'
// import Renderer from '../core/render'
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
  }
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
  //   summaryNode.forEach(e => e.position !== summaryNode[0].position && (sameSide = false))
  //   !sameSide && vue.$message.warning('请选择同边节点')
  //   return !sameSide
  // }
}
const getAnswer = function (key, ...args) {
  return canAddSummary[key](...args)
}
const dropList = (node, list) => {
  let start = 0,
    lastDropLList = []
  for (let i = 1; i < list.length; i++) {
    if (
      list[i - 1] + 1 !== list[i] ||
      node.parent.getChildren()[list[i - 1]].position !==
        node.parent.getChildren()[list[i]].position
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
    const nodes = km.getSelectedNodes()
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
        startId: summaryList[0].data.id,
        endIndex: summaryList[summaryList.length - 1].getIndex(),
        endId: summaryList[summaryList.length - 1].data.id
      }
      km.createNode(text, parent, parent.getSummary().length, 'summary', summaryData)
    })

    km.refresh()
    km.fire('textedit')
  },
  queryState(km) {
    const nodes = km.getSelectedNodes()
    // 标识选中的节点中是否都是普通节点
    let allCommonNode = true
    nodes.forEach(e => e.type === 'summary' && (allCommonNode = false))
    return (km.getSelectedNode() && km.getSelectedNode()?.parent && km.getAllNode().length) > 1 &&
      allCommonNode
      ? 0
      : -1
  }
})

Module.register('SummaryModule', function () {
  return {
    commands: {
      AddNodeSummary: AddSummaryCommand
    },

    commandShortcutKeys: {}
  }
})
