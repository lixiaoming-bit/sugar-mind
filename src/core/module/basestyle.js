import Command from '../core/command'
import Module from '../core/module'
import TextRenderer from './text'
const kity = window.kity
Module.register('basestylemodule', function () {
  const km = this

  TextRenderer.registerStyleHook(function (node, textGroup) {
    const getDataOrStyle = name => node.getData(name) || node.getStyle(name)
    const color = getDataOrStyle('color')
    const fontSize = getDataOrStyle('font-size') + 'px'
    const fontFamily = getDataOrStyle('font-family') || "微软雅黑, 'Microsoft YaHei'"
    const lineHeight = getDataOrStyle('line-height')
    const fontStyle = getDataOrStyle('font-style')
    const fontWeight = getDataOrStyle('font-weight')

    textGroup.foreign.setStyle({ color, fontSize, fontFamily, lineHeight, fontStyle, fontWeight })
  })
  return {
    commands: {
      /**
       * @command Bold
       * @description 加粗选中的节点
       * @shortcut ctrl + B
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       *   1: 当前已选中的节点已加粗
       */
      bold: kity.createClass('boldCommand', {
        base: Command,

        execute: function (km) {
          const nodes = km.getSelectedNodes()
          if (this.queryState('bold') === 1) {
            nodes.forEach(function (n) {
              n.setData('font-weight').render()
            })
          } else {
            nodes.forEach(function (n) {
              n.setData('font-weight', 'bold').render()
            })
          }
          km.layout()
        },
        queryState: function () {
          const nodes = km.getSelectedNodes()
          let result = 0
          if (nodes.length === 0) {
            return -1
          }
          nodes.forEach(function (n) {
            if (n && n.getData('font-weight')) {
              result = 1
              return false
            }
          })
          return result
        }
      }),
      /**
       * @command Italic
       * @description 加斜选中的节点
       * @shortcut ctrl + I
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       *   1: 当前已选中的节点已加斜
       */
      italic: kity.createClass('italicCommand', {
        base: Command,

        execute: function (km) {
          const nodes = km.getSelectedNodes()
          if (this.queryState('italic') === 1) {
            nodes.forEach(function (n) {
              n.setData('font-style').render()
            })
          } else {
            nodes.forEach(function (n) {
              n.setData('font-style', 'italic').render()
            })
          }

          km.layout()
        },
        queryState: function () {
          const nodes = km.getSelectedNodes()
          let result = 0
          if (nodes.length === 0) {
            return -1
          }
          nodes.forEach(function (n) {
            if (n && n.getData('font-style')) {
              result = 1
              return false
            }
          })
          return result
        }
      })
    },
    commandShortcutKeys: {
      bold: 'normal::ctrl+b|normal::command+b', //bold
      italic: 'normal::ctrl+i|normal::command+i' //italic
    }
  }
})
