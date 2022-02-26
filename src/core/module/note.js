/**
 * 支持节点详细信息（HTML）格式
 */
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity
Module.register('NoteModule', function () {
  const NOTE_PATH =
    'M9,9H3V8h6L9,9L9,9z M9,7H3V6h6V7z M9,5H3V4h6V5z M8.5,11H2V2h8v7.5 M9,12l2-2V1H1v11'

  /**
   * @command Note
   * @description 设置节点的备注信息
   * @param {string} note 要设置的备注信息，设置为 null 则移除备注信息
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const NoteCommand = kity.createClass('NoteCommand', {
    base: Command,

    execute: function (minder, note) {
      const node = minder.getSelectedNode()
      node.setData('note', note)
      node.render()
      node.getMinder().layout(300)
    },

    queryState: function (minder) {
      return minder.getSelectedNodes().length === 1 ? 0 : -1
    },

    queryValue: function (minder) {
      const node = minder.getSelectedNode()
      return node && node.getData('note')
    }
  })

  class NoteIcon extends kity.Group {
    constructor() {
      super()
      this.width = 16
      this.height = 17
      this.rect = new kity.Rect(16, 17, 0.5, -8.5, 2).fill('transparent')
      this.path = new kity.Path().setPathData(NOTE_PATH).setTranslate(2.5, -6.5)
      this.addShapes([this.rect, this.path])

      this.on('mouseover', function () {
        this.rect.fill('rgba(255, 255, 200, .8)')
      }).on('mouseout', function () {
        this.rect.fill('transparent')
      })

      this.setStyle('cursor', 'pointer')
    }
  }

  const NoteIconRenderer = kity.createClass('NoteIconRenderer', {
    base: Renderer,

    create: function (node) {
      const icon = new NoteIcon()
      console.log('icon: ', icon);
      icon.on('mousedown', function (e) {
        e.preventDefault()
        node.getMinder().fire('editnoterequest')
      })
      icon.on('mouseover', function () {
        node.getMinder().fire('shownoterequest', { node: node, icon: icon })
      })
      icon.on('mouseleave', function () {
        node.getMinder().fire('hidenoterequest', { node: node, icon: icon })
      })
      return icon
    },

    shouldRender: function (node) {
      return node.getData('note')
    },

    update: function (icon, node, box) {
      const x = box.right + node.getStyle('space-left')
      const y = box.cy

      icon.path.fill(node.getStyle('color'))
      icon.setTranslate(x, y)

      return new kity.Box(x, Math.round(y - icon.height / 2), icon.width, icon.height)
    }
  })

  return {
    renderers: {
      right: NoteIconRenderer
    },
    commands: {
      note: NoteCommand
    }
  }
})
