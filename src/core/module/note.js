/**
 * 支持节点详细信息（HTML）格式
 */
import Command from '../core/command'
import Module from '../core/module'
import Renderer from '../core/render'
const kity = window.kity
Module.register('NoteModule', function () {
  // const NOTE_PATH =
  //   'M9,9H3V8h6L9,9L9,9z M9,7H3V6h6V7z M9,5H3V4h6V5z M8.5,11H2V2h8v7.5 M9,12l2-2V1H1v11'
  const NOTE_PATH =
    'M625.728 57.472c19.264 0 34.688 6.848 48.128 20.16l208.96 207.04c14.272 13.12 21.568 29.568 21.568 49.28v504.576c0 71.808-56.256 127.744-128.576 127.744H252.16c-72.128 0-128.576-55.68-128.576-127.744V184.704c0-71.68 56.256-127.232 128.576-127.232z m-34.304 76.8H252.16c-30.144 0-51.776 21.376-51.776 50.432v653.824c0 29.44 21.888 50.944 51.776 50.944h523.648c30.016 0 51.84-21.632 51.84-50.944l-0.128-464.512H687.488A96 96 0 0 1 591.936 287.36l-0.448-9.216V134.208zM665.6 704a38.4 38.4 0 0 1 0 76.8H294.4a38.4 38.4 0 0 1 0-76.8h371.2z m0-192a38.4 38.4 0 0 1 0 76.8H294.4a38.4 38.4 0 0 1 0-76.8h371.2z m-192-192a38.4 38.4 0 1 1 0 76.8H294.4a38.4 38.4 0 1 1 0-76.8h179.2z m181.824-152.512v110.592a32 32 0 0 0 26.24 31.488l5.76 0.512h111.872L655.424 167.424z'

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
      this.width = 18
      this.height = 18
      this.rect = new kity.Rect(18, 18, 0, -8, 2).fill('transparent')
      this.path = new kity.Path().setPathData(NOTE_PATH).setTranslate(1, -8).setScale(0.017)
      this.addShapes([this.rect, this.path])
      this.setStyle('cursor', 'pointer')
    }
  }

  const NoteIconRenderer = kity.createClass('NoteIconRenderer', {
    base: Renderer,

    create: function (node) {
      const icon = new NoteIcon()
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
