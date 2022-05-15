/**
 * 设置标签
 */
import utils from '../core/utils'
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'

const kity = window.kity

Module.register('LabelModule', function () {
  /**
   * @command Label
   * @description 设置节点的标签
   * @param {string []} label 要设置的标签信息
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const LabelCommand = kity.createClass('LabelCommand', {
    base: Command,

    execute(minder, label) {
      const node = minder.getSelectedNode()
      node.setData('label', label)
      node.render()
      minder.layout(300)
    },

    queryState(minder) {
      return minder.getSelectedNodes().length ? 0 : -1
    },

    queryValue(minder) {
      const node = minder.getSelectedNode()
      return node && node.getData('label')
    }
  })

  class Label extends kity.Group {
    constructor(node) {
      super()

      const background = node.getStyle('label-background')
      const labelFontSize = node.getStyle('label-font-size')
      const strokeColor = node.getStyle('label-stroke-color')
      const strokeWidth = node.getStyle('label-stroke-width')

      this.setId(utils.uuid('node_label'))
      this.rect = new kity.Rect().fill(background).stroke(strokeColor, strokeWidth)
      this.text = new kity.Text().setVerticalAlign('middle').setFontSize(labelFontSize)
      this.addShapes([this.rect, this.text])
      this.initEvents(node)
    }
    setContent(node) {
      const paddingX = node.getStyle('label-padding-left')
      const paddingY = node.getStyle('label-padding-top')
      const marginTop = node.getStyle('label-margin-top')
      const labelRadius = node.getStyle('label-radius')

      let [value] = node.getData('label') || []
      this.text.setContent(value)

      const textBox = this.text.getBoundaryBox()
      const contentBox = node.getContentBox()

      let width = Math.round(textBox.width + paddingX * 2)
      const isEclipses = width > contentBox.width

      while (width > contentBox.width && value.length) {
        value = value.slice(0, -1)
        const textBox = this.text.getBoundaryBox()
        width = Math.round(textBox.width + paddingX * 2)
        this.text.setContent(value)
      }

      if (isEclipses) {
        value = value + '...'
      }
      this.text.setContent(value)

      this.rect.setPosition(contentBox.x, marginTop - 5)
      this.text.setPosition(contentBox.x + paddingX, paddingY * 2 + marginTop - 5)

      this.width = isEclipses ? contentBox.width : width
      this.height = Math.round(textBox.height + paddingY * 2)

      this.rect.setSize(this.width, this.height)
      this.rect.setRadius(labelRadius)
    }
    initEvents(node) {
      const minder = node.getMinder()
      this.on('click', e => {
        e.stopPropagation()
        minder.select(node, true)
        minder.execCommand('OpenPopover', 'label')
      })
      this.on('dblclick', e => e.stopPropagation())
    }
  }

  const LabelRenderer = kity.createClass('LabelRenderer', {
    base: Renderer,

    create(node) {
      this.label = new Label(node)
      node.getRenderContainer().appendShape(this.label)
      node.labelRenderer = this
      return this.label
    },

    shouldRender(node) {
      let label = node.getData('label')
      if (Array.isArray(label)) label = label.filter(Boolean)
      return label && label.length > 0
    },

    update(label, node, box) {
      // 拖动状态不显示 不放在shouldRender 此种效率最高
      if (node._isDragging) {
        label.setVisible(false)
        return
      }
      label.setContent(node)
      label.setVisible(true)

      // const vector = { x: box.x, y: box.y + 10 }

      this.label.setTranslate(0, box.height / 2 + 12)

      return new kity.Box(box.x, box.y, box.width, box.height)
    }
  })

  return {
    renderers: {
      outside: LabelRenderer
    },
    commands: {
      label: LabelCommand
    }
  }
})
