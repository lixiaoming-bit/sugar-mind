/**
 * 打补丁
 */
import Minder from './minder'
const kity = window.kity

function insertNode(minder, info, parent, index) {
  parent = minder.createNode(info.data, parent, index)
  info.children.forEach(function (childInfo, index) {
    insertNode(minder, childInfo, parent, index)
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
    while ((segment = path.shift())) {
      if (segment === 'children') continue
      if (typeof index !== 'undefined') node = node.getChild(index)
      index = +segment
    }
    patch.index = index
    patch.node = node
  }

  const express = (patch.express = [changed, patch.op].join('.'))

  switch (express) {
    case 'theme.replace':
      minder.useTheme(patch.value)
      break
    case 'template.replace':
      minder.useTemplate(patch.value)
      break
    case 'node.add':
      insertNode(minder, patch.value, patch.node, patch.index).renderTree()
      minder.layout()
      break
    case 'node.remove':
      minder.removeNode(patch.node.getChild(patch.index))
      minder.layout()
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
  applyPatches: function (patches) {
    for (let i = 0; i < patches.length; i++) {
      applyPatch(this, patches[i])
    }

    this.fire('contentchange')
    return this
  }
})
