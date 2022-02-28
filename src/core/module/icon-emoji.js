import utils from '../core/utils'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity

Module.register('EmojiModule', function () {
  const EMOJI_DATA = 'emoji'
  let EMOJI_IMAGES = []

  // 进度图标的图形

  class EmojiIcon extends kity.Group {
    constructor() {
      super()
      this.setSize(24)
      this.create()
      this.setId(utils.uuid('node_emoji'))
    }
    setSize(size) {
      this.width = size
      this.height = size
    }

    create() {
      const emojiImage = new kity.Image('', 24, 24).setStyle('cursor', 'normal')
      this.addShape(emojiImage)
      this.emojiImage = emojiImage
    }

    setValue(value) {
      const url = EMOJI_IMAGES[value]

      if (url) {
        this.emojiImage.setUrl(url)
      }
    }
  }

  /**
   * @command Emoji
   * @description 设置节点的表情信息（添加一个表情小图标）
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const EmojiCommand = kity.createClass('EmojiCommand', {
    base: Command,
    execute: function (km, value) {
      EMOJI_IMAGES = km.getOption('emojiImages')
      const nodes = km.getSelectedNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setData(EMOJI_DATA, value ?? null).render()
      }
      km.layout()
    },
    queryValue: function (km) {
      const nodes = km.getSelectedNodes()
      let val
      for (let i = 0; i < nodes.length; i++) {
        val = nodes[i].getData(EMOJI_DATA)
        if (val) break
      }
      return val || null
    },

    queryState: function (km) {
      return km.getSelectedNodes().length ? 0 : -1
    }
  })
  const EmojiRenderer = kity.createClass('EmojiRenderer', {
    base: Renderer,

    create: function () {
      return new EmojiIcon()
    },

    shouldRender: function (node) {
      return EMOJI_IMAGES[node.getData(EMOJI_DATA)]
    },

    update: function (icon, node, box) {
      const data = node.getData(EMOJI_DATA)
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
      emoji: EmojiCommand
    },
    renderers: {
      left: EmojiRenderer
    },
    defaultOptions: {
      emojiImages: []
    }
  }
})
