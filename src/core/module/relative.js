import utils from '../core/utils'
import Module from '../core/module'
import Command from '../core/command'
import Renderer from '../core/render'
import Minder from '../core/minder'
import MinderNode from '../core/node'
const kity = window.kity

Module.register('Relative', function () {
  // 关联节点的数据结构
  // const relatives = [
  //   {
  //     "id": "cjce4jtleg00",
  //     "start": {
  //       "nodeId": "cjce4gpcj5c0",
  //       "control": {
  //         "x": 125,
  //         "y": 0
  //       }
  //     },
  //     "end": {
  //       "nodeId": "cjce4gy4e8o0",
  //       "control": {
  //         "x": 127,
  //         "y": 0
  //       }
  //     },
  //     "style": [],
  //     "text": "\u5173\u8054"
  //   }
  // ]

  //
  const getDataOrStyle = (node, key, defaultValue = '') => {
    return node.getData(key) || node.getStyle(key) || defaultValue
  }

  kity.extendClass(Minder, {
    setRelative(nodes) {
      if (!nodes || !Array.isArray(nodes)) return
      if (nodes.length === 2) {
        const [start, end] = nodes
        this._relatives.push({
          id: utils.guid(),
          start: {
            nodeId: start.getData('id'),
            point: {}
          },
          end: {
            nodeId: end.getData('id'),
            point: {}
          },
          styles: [],
          text: '关联\n'
        })
      }
    },

    getRelatives() {
      return this._relatives || []
    },

    setSelectedRelatives(relativeId) {
      this._selectedRelatives.push(relativeId)
    },

    removeSelectedRelatives(relativeId) {
      const index = this._selectedRelatives.findIndex(item => item === relativeId)
      if (index > -1) this._selectedRelatives.splice(index, 1)
    },

    getSelectedRelatives() {
      return this._selectedRelatives
    },

    getRelativesContainer() {
      return this._relativeContainer
    },

    createRelative(nodes) {
      const flag = nodes.some(node => !(node instanceof MinderNode))
      if (flag) return
      this.setRelative(nodes)
    },

    // 删除关联线 默认删除全部
    removeRelative(relativeIds) {
      if (!relativeIds) {
        this._relativeContainer = new kity.Group().setId(utils.uuid('minder_marker_group'))
        this._relatives = []
        this._selectedRelatives = []
      } else {
        relativeIds = Array.isArray(relativeIds) ? relativeIds : [relativeIds]
        relativeIds.forEach(relativeId => {
          const shape = this._relativeContainer.getShapeById(relativeId)
          this._relativeContainer.removeShape(shape)
        })
        this._relatives = this._relatives.filter(item => !relativeIds.includes(item.id))
        this._selectedRelatives = this._selectedRelatives.filter(
          item => !relativeIds.includes(item)
        )
      }
    },
    // 更新关联关系 全量
    updateRelative(node) {
      const relativeConnection = node._relativeConnection || []
      const relativeNode = node.getData('relative') || []
      if (!relativeNode.length || !relativeConnection.length) {
        this.removeRelative(node)
        return
      }
      for (let i = 0; i < relativeNode.length; i++) {
        const item = relativeNode[i]
        const relativeParentNode = item.parent
        if (relativeParentNode.isCollapsed()) {
          node._relativeConnection[i].setVisible(false)
        }
        node._relativeConnection[i].setVisible(true)

        // const shape = getDataOrStyle(item, 'shape', 'default')
        const strokeColor = getDataOrStyle(item, 'relative-color', 'white')
        const strokeWidth = getDataOrStyle(item, 'relative-width', 2)

        node._relativeConnection[i].stroke(strokeColor, strokeWidth)
      }
    }
  })

  kity.extendClass(MinderNode, {
    isRelative() {
      const relatives = this.getMinder().getRelatives()
      const nodeId = this.getData('id')
      const target = relatives.some(
        item => item.start.nodeId === nodeId || item.end.nodeId === nodeId
      )
      return target
    },
    getIsAllowedRelatives() {
      const relatives = this.getMinder.getRelatives()
      const nodeId = this.getData('id')
      const targetNodeId = []
      relatives.forEach(item => {
        if (item.start.nodeId === nodeId) {
          const node = this.getMinder().getNodeById(item.end.nodeId)
          if (node.getRenderer('RelativeRender').getRenderShape()) targetNodeId.push(node)
        }
      })
      return targetNodeId
    }
  })

  // 创建关联关系
  // 1. 无选中节点
  // 2. 选中一个节点
  // 3. 选中两个节点
  const RelativeCommand = kity.createClass('RelativeCommand', {
    base: Command,

    execute: function (km) {
      const selected = km.getSelectedNodes()
      km.setRelative(selected)
    },

    queryState: function (km) {
      const selected = km.getSelectedNodes() || []
      const { length: len } = selected
      return len <= 2 ? 0 : -1
    }
  })
  // 删除关联线 真实删除
  // 手动删除
  // 删除节点时 自动删除
  const RelativeRemoveCommand = kity.createClass('RelativeRemoveCommand', {
    base: Command,

    execute(km) {
      const relatives = km.getSelectedRelatives()
      km.removeRelative(relatives)
    },
    queryState(km) {
      return km.getSelectedRelatives() ? 0 : -1
    }
  })
  class Relative extends kity.Group {
    constructor(node) {
      super()
      const relativeShape = new kity.Path()
      const relativeShapeShadow = new kity.Path()
      const relativesContainer = node.getMinder().getRelativesContainer()
      relativesContainer.addShapes([relativeShape, relativeShapeShadow])
    }
    initEvents() {}
    setContent() {}
  }

  // 渲染器
  const RelativeRender = kity.createClass('RelativeRender', {
    base: Renderer,

    // 创建关联线
    create: function (node) {
      this.relative = new Relative(node)
      node.getRenderContainer().prependShape(this.relative)
      node.relativeRender = this
      return this.relative
    },

    // 关联线显示：关联线数组中 以当前节点开头且能够被渲染的连线
    shouldRender: function (node) {
      this._isAllowedRelatives = node.getMinder().getIsAllowedRelatives()
      return this._isAllowedRelatives.length
    },

    update: function (entity, node, box) {
      const shape = node.getStyle('shape')
      const paddingLeft = node.getStyle('padding-left')
      const paddingRight = node.getStyle('padding-right')
      const paddingTop = node.getStyle('padding-top')
      const paddingBottom = node.getStyle('padding-bottom')

      const outlineBox = {
        x: box.x - paddingLeft,
        y: box.y - paddingTop,
        width: box.width + paddingLeft + paddingRight,
        height: box.height + paddingTop + paddingBottom
      }

      let radius = node.getStyle('radius')
      // 天盘图圆形的情况
      if (shape && shape === 'circle') {
        const p = Math.pow
        const r = Math.round

        radius = r(Math.sqrt(p(outlineBox.width, 2) + p(outlineBox.height, 2)) / 2)

        outlineBox.x = box.cx - radius
        outlineBox.y = box.cy - radius
        outlineBox.width = 2 * radius
        outlineBox.height = 2 * radius
      }

      entity
        .setPosition(outlineBox.x, outlineBox.y)
        .setSize(outlineBox.width, outlineBox.height)
        .setRadius(radius)
        .fill(node.getData('background') || node.getStyle('background'))
        .stroke(node.getStyle('stroke'), node.getStyle('stroke-width'))
      return new kity.Box(outlineBox)
    }
  })
  return {
    init: function () {
      // this._relativeContainer = new kity.Group().setId(utils.uuid('minder_marker_group'))
      this._relatives = []
      this._selectedRelatives = []
      // this.getRenderContainer().prependShape(this._relativeContainer)
    },
    renderers: {
      outline: RelativeRender
    },
    commands: {
      relative: RelativeCommand,
      relativeremove: RelativeRemoveCommand
    }
  }
})
