import utils from '../core/utils'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

Module.register('ProgressModule', function () {
  const PROGRESS_DATA = 'progress'
  let PROGRESS_IMAGES = []

  // 进度图标的图形

  class ProgressIcon extends kity.Group {
    constructor() {
      super()
      this.setSize(24)
      this.create()
      this.setId(utils.uuid('node_progress'))
    }
    setSize(size) {
      this.width = size
      this.height = size
    }

    create() {
      const progressImage = new kity.Image('', 24, 24)
      this.addShape(progressImage)
      this.progressImage = progressImage
    }

    setValue(value) {
      const url = PROGRESS_IMAGES[value]

      if (url) {
        this.progressImage.setUrl(url)
      }
    }
  }

  /**
   * @command Progress
   * @description 设置节点的进度信息（添加一个进度小图标）
   * @param {number} value 要设置的进度
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const ProgressCommand = kity.createClass('ProgressCommand', {
    base: Command,
    execute: function (km, value) {
      PROGRESS_IMAGES = km.getOption('progressImages')
      const nodes = km.getSelectedNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setData(PROGRESS_DATA, value ?? null).render()
      }
      km.layout()
    },
    queryValue: function (km) {
      const nodes = km.getSelectedNodes()
      let val
      for (let i = 0; i < nodes.length; i++) {
        val = nodes[i].getData(PROGRESS_DATA)
        if (val) break
      }
      return val || null
    },

    queryState: function (km) {
      return km.getSelectedNodes().length ? 0 : -1
    }
  })
  const ProgressRenderer = kity.createClass('ProgressRenderer', {
    base: Renderer,

    create: function () {
      return new ProgressIcon()
    },

    shouldRender: function (node) {
      return PROGRESS_IMAGES[node.getData(PROGRESS_DATA)]
    },

    update: function (icon, node, box) {
      const data = node.getData(PROGRESS_DATA)
      const spaceLeft = node.getStyle('space-left')

      icon.setValue(data)

      const x = box.left - icon.width - spaceLeft
      const y = -icon.height / 2

      icon.setTranslate(x, y)

      return new kity.Box(x, y, icon.width, icon.height)
    }
  })

  return {
    commands: {
      progress: ProgressCommand
    },
    renderers: {
      left: ProgressRenderer
    },
    defaultOptions: {
      progressImages: []
    }
  }
})
