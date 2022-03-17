import Command from '../core/command'
import Module from '../core/module'
import TextRenderer from './text'
const kity = window.kity

const getNodeDataOrStyle = (node, name) => node.getData(name) || node.getStyle(name)

TextRenderer.registerStyleHook(function (node, textGroup) {
  const color = node.getStyle('color')
  const fontFamily = getNodeDataOrStyle(node, 'font-family')
  const fontSize = getNodeDataOrStyle(node, 'font-size')
  const lineHeight = textGroup.getHeight() + 'px'

  textGroup.foreign.setStyle({ fontFamily, fontSize, color, lineHeight })

  // textGroup.fill(foreColor)

  // textGroup.eachItem(function (index, item) {
  //   item.setFont({
  //     family: fontFamily,
  //     size: fontSize
  //   })
  // })
})

Module.register('fontmodule', {
  commands: {
    /**
     * @command ForeColor
     * @description 设置选中节点的字体颜色
     * @param {string} color 表示颜色的字符串
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     * @return 如果只有一个节点选中，返回已选中节点的字体颜色；否则返回 'mixed'。
     */
    forecolor: kity.createClass('fontcolorCommand', {
      base: Command,
      execute: function (km, color) {
        const nodes = km.getSelectedNodes()
        nodes.forEach(function (n) {
          n.setData('color', color)
          n.render()
        })
      },
      queryState: function (km) {
        return km.getSelectedNodes().length === 0 ? -1 : 0
      },
      queryValue: function (km) {
        if (km.getSelectedNodes().length === 1) {
          return km.getSelectedNodes()[0].getData('color')
        }
        return 'mixed'
      }
    }),

    /**
     * @command Background
     * @description 设置选中节点的背景颜色
     * @param {string} color 表示颜色的字符串
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     * @return 如果只有一个节点选中，返回已选中节点的背景颜色；否则返回 'mixed'。
     */
    background: kity.createClass('backgroudCommand', {
      base: Command,

      execute: function (km, color) {
        const nodes = km.getSelectedNodes()
        nodes.forEach(function (n) {
          n.setData('background', color)
          n.render()
        })
      },
      queryState: function (km) {
        return km.getSelectedNodes().length === 0 ? -1 : 0
      },
      queryValue: function (km) {
        if (km.getSelectedNodes().length === 1) {
          return km.getSelectedNodes()[0].getData('background')
        }
        return 'mixed'
      }
    }),

    /**
     * @command FontFamily
     * @description 设置选中节点的字体
     * @param {string} family 表示字体的字符串
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     * @return 返回首个选中节点的字体
     */
    fontfamily: kity.createClass('fontfamilyCommand', {
      base: Command,

      execute: function (km, family) {
        const nodes = km.getSelectedNodes()
        nodes.forEach(function (n) {
          n.setData('font-family', family)
          n.render()
          km.layout()
        })
      },
      queryState: function (km) {
        return km.getSelectedNodes().length === 0 ? -1 : 0
      },
      queryValue: function (km) {
        const node = km.getSelectedNode()
        if (node) return node.getData('font-family')
        return null
      }
    }),

    /**
     * @command FontSize
     * @description 设置选中节点的字体大小
     * @param {number} size 字体大小（px）
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     * @return 返回首个选中节点的字体大小
     */
    fontsize: kity.createClass('fontsizeCommand', {
      base: Command,

      execute: function (km, size) {
        const nodes = km.getSelectedNodes()
        nodes.forEach(function (n) {
          n.setData('font-size', size)
          n.render()
          km.layout(300)
        })
      },
      queryState: function (km) {
        return km.getSelectedNodes().length === 0 ? -1 : 0
      },
      queryValue: function (km) {
        const node = km.getSelectedNode()
        if (node) return node.getData('font-size')
        return null
      }
    })
  }
})
