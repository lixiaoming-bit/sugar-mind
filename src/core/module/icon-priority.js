import utils from '../core/utils'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

Module.register('PriorityModule', function () {
  const PRIORITY_DATA = 'priority'
  let PRIORITY_IMAGES = []

  // 优先级图标的图形

  class PriorityIcon extends kity.Group {
    constructor() {
      super()
      this.setSize(24)
      this.create()
      this.setId(utils.uuid('node_priority'))
    }
    setSize(size) {
      this.width = size
      this.height = size
    }

    create() {
      const priorityImage = new kity.Image('', 24, 24)
      this.addShape(priorityImage)
      this.priorityImage = priorityImage
    }

    setValue(value) {
      const url = PRIORITY_IMAGES[value]

      if (url) {
        this.priorityImage.setUrl(url)
      }
    }
  }
  /**
   * @command Priority
   * @description 设置节点的优先级信息
   * @param {number} value 要设置的优先级（添加一个优先级小图标）
   *     取值为 0 移除优先级信息；
   *     取值为 1 - 9 设置优先级，超过 9 的优先级不渲染
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const PriorityCommand = kity.createClass('SetPriorityCommand', {
    base: Command,
    execute: function (km, value) {
      const nodes = km.getSelectedNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setData(PRIORITY_DATA, value ?? null).render()
      }
      km.layout()
    },
    queryValue: function (km) {
      const nodes = km.getSelectedNodes()
      const node = nodes.find(node => typeof node.getData(PRIORITY_DATA) === 'number')
      return node ? node.getData(PRIORITY_DATA) : null
    },

    queryState: function (km) {
      return km.getSelectedNodes().length ? 0 : -1
    }
  })

  const PriorityRenderer = kity.createClass('PriorityRenderer', {
    base: Renderer,

    create: function () {
      return new PriorityIcon()
    },

    shouldRender: function (node) {
      return PRIORITY_IMAGES[node.getData(PRIORITY_DATA)]
    },

    update: function (icon, node, box) {
      const data = node.getData(PRIORITY_DATA)
      const spaceLeft = node.getStyle('space-left')

      icon.setValue(data)

      const height = icon.height

      const x = box.left - icon.width - spaceLeft / 2
      const y = -height / 2

      icon.setTranslate(x, y)

      return new kity.Box({
        x: x,
        y: y,
        width: icon.width,
        height: icon.height
      })
    }
  })
  return {
    init(options) {
      PRIORITY_IMAGES = options.priorityImages
    },
    defaultOptions: {
      priorityImages: []
    },
    commands: {
      priority: PriorityCommand
    },
    renderers: {
      left: PriorityRenderer
    }
  }
})
