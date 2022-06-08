// 打补丁
import { unionBy } from 'lodash-es'
import Minder from './minder'
const kity = window.kity

function insertNode(minder, info, parent, index, type) {
  parent = minder.createNode(info.data, parent, index, type, info.data)
  info.children?.common?.forEach(function (childInfo, index) {
    insertNode(minder, childInfo, parent, index)
  })
  info.children?.summary?.forEach(function (childInfo, index) {
    insertNode(minder, childInfo, parent, index, 'summary')
  })
  return parent
}

function applyPatch(minder, patch) {
  // patch.op - 操作，包括 remove, add, replace
  // patch.path - 路径，如 '/root/children/1/data'
  // patch.value - 数据，如 { text: "思路" }
  let path = patch.path.split('/')
  path.shift()

  let changed = path.shift()
  let node

  if (changed === 'root') {
    const dataIndex = path.indexOf('data')
    if (dataIndex > -1) {
      changed = 'data'
      const dataPath = path.splice(dataIndex + 1)
      patch.dataPath = dataPath
    } else {
      changed = 'node'
    }

    node = minder.getRoot()
    let segment
    let index
    const hasSummary = patch.path.indexOf('summary') > -1
    while ((segment = path.shift())) {
      if (segment === 'children' || segment === 'common' || segment === 'summary') continue
      if (typeof index !== 'undefined') {
        const sumNode = hasSummary && node.getSumByIdx(index)
        const case1 = node.getChild(index) || sumNode
        const case2 = sumNode || node.getChild(index)
        node = patch.op === 'add' ? case1 : case2
      }
      index = +segment
    }
    patch.index = index
    patch.node = node
  } else if (changed === 'relationship') {
    const [index] = patch.path.match(/\d+/g) || []
    patch.index = index
  }

  const express = (patch.express = [changed, patch.op].join('.'))
  console.log('express: ', express)

  switch (express) {
    case 'theme.replace':
      minder.useTheme(patch.value)
      break
    case 'template.replace':
      minder.useTemplate(patch.value)
      break
    case 'node.add':
      patch.path.indexOf('summary') === -1
        ? insertNode(minder, patch.value, patch.node, patch.index).renderTree()
        : insertNode(minder, patch.value, patch.node, patch.index, 'summary').renderTree()
      minder.layout()
      break
    case 'node.remove':
      minder.removeNode(
        patch.path.indexOf('summary') === -1
          ? patch.node.getChild(patch.index)
          : patch.node.getSumByIdx(patch.index)
      )
      minder.layout()
      break
    case 'relationship.add':
      minder.createRelationshipConnect([
        minder.getNodeById(patch.value.start.id),
        minder.getNodeById(patch.value.end.id)
      ])
      break
    case 'relationship.remove':
      var removed = minder.getRawRelationship()[patch.index]
      if (removed) {
        minder.removeRelationship([
          minder.getNodeById(removed.start.id),
          minder.getNodeById(removed.end.id)
        ])
      }

      break
    case 'data.add':
    case 'data.replace':
    case 'data.remove':
      var data = patch.node.data
      var field
      path = patch.dataPath.slice()
      while (data && path.length > 1) {
        field = path.shift()
        if (field in data) {
          data = data[field]
        } else if (patch.op != 'remove') {
          data = data[field] = {}
        }
      }
      if (data) {
        field = path.shift()
        data[field] = patch.value
      }
      if (field === 'expandState') {
        node.renderTree()
      } else {
        node.render()
      }
      minder.layout()
  }

  minder.fire('patch', { patch: patch })
}

kity.extendClass(Minder, {
  applyPatches(patches) {
    // 调整diff 的顺序 关联线需要在节点之后
    const summaries = []
    const relationships = []
    const rest = []
    patches.forEach(patch => {
      // 概要
      if (patch.path.indexOf('summary') !== -1 && patch?.op === 'add') {
        summaries.push(patch)
      }
      // 关系
      else if (patch.path.indexOf('relationship') !== -1) {
        relationships.push(patch)
      }
      // 剩余
      else {
        rest.push(patch)
      }
    })
    relationships.forEach(patch => {
      patch.path = patch.path.slice(0, 16)
    })
    patches = [...rest, ...summaries, ...unionBy(relationships, 'path')]
    for (let i = 0; i < patches.length; i++) {
      applyPatch(this, patches[i])
    }
    this.layout()
    // this.fire('contentchange')
    return this
  }
})
