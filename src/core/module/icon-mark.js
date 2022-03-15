import utils from '../core/utils'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

Module.register('MarkModule', function () {
  const MARK_DATA = 'mark'
  let MARK_IMAGES = []

  // 进度图标的图形

  class MarkIcon extends kity.Group {
    constructor() {
      super()
      this.setSize(24)
      this.create()
      this.setId(utils.uuid('node_mark'))
    }
    setSize(size) {
      this.width = size
      this.height = size
    }

    create() {
      const markImage = new kity.Image('', 24, 24)
      this.addShape(markImage)
      this.markImage = markImage
    }

    setValue(value) {
      const url = MARK_IMAGES[value]

      if (url) {
        this.markImage.setUrl(url)
      }
    }
  }

  /**
   * @command Mark
   * @description 设置节点的标记信息（添加一个标记小图标）
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const MarkCommand = kity.createClass('MarkCommand', {
    base: Command,
    execute: function (km, value) {
      MARK_IMAGES = km.getOption('markImages')
      const nodes = km.getSelectedNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setData(MARK_DATA, value ?? null).render()
      }
      km.layout()
    },
    queryValue: function (km) {
      const nodes = km.getSelectedNodes()
      let val
      for (let i = 0; i < nodes.length; i++) {
        val = nodes[i].getData(MARK_DATA)
        if (val) break
      }
      return val || null
    },

    queryState: function (km) {
      return km.getSelectedNodes().length ? 0 : -1
    }
  })
  const MarkRenderer = kity.createClass('MarkRenderer', {
    base: Renderer,

    create: function () {
      return new MarkIcon()
    },

    shouldRender: function (node) {
      return MARK_IMAGES[node.getData(MARK_DATA)]
    },

    update: function (icon, node, box) {
      const data = node.getData(MARK_DATA)
      const spaceLeft = node.getStyle('space-left')

      icon.setValue(data)

      const height = node.getTextGroup().getHeight()

      const x = box.left - icon.width - spaceLeft / 2
      const y = -height / 2

      icon.setTranslate(x, y)

      return new kity.Box(x, y, icon.width, icon.height)
    }
  })

  return {
    commands: {
      mark: MarkCommand
    },
    renderers: {
      left: MarkRenderer
    },
    defaultOptions: {
      markImages: []
    }
  }
})
