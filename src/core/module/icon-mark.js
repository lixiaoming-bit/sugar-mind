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
    constructor(node) {
      super()
      this.initEvents(node)
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

    initEvents(node) {
      const minder = node.getMinder()
      this.on('click', () => {
        minder.execCommand('OpenPopover', 'icon', 'mark')
      })
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
    execute(km, value) {
      const nodes = km.getSelectedNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setData(MARK_DATA, value ?? null).render()
      }
      km.layout()
    },
    queryValue(km) {
      const nodes = km.getSelectedNodes()
      const node = nodes.find(node => typeof node.getData(MARK_DATA) === 'number')
      return node ? node.getData(MARK_DATA) : null
    },

    queryState(km) {
      return km.getSelectedNodes().length ? 0 : -1
    }
  })
  const MarkRenderer = kity.createClass('MarkRenderer', {
    base: Renderer,

    create(node) {
      return new MarkIcon(node)
    },

    shouldRender(node) {
      return MARK_IMAGES[node.getData(MARK_DATA)]
    },

    update(icon, node, box) {
      const data = node.getData(MARK_DATA)
      const spaceLeft = node.getStyle('space-left')

      icon.setValue(data)

      const height = icon.height

      const x = box.left - icon.width - spaceLeft / 2
      const y = -height / 2

      icon.setTranslate(x, y)

      return new kity.Box(x, y, icon.width, icon.height)
    }
  })

  return {
    init(options) {
      MARK_IMAGES = options.markImages
    },
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
