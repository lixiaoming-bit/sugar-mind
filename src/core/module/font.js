import Command from '../core/command'
import Module from '../core/module'
import TextRenderer from './text'
const kity = window.kity

TextRenderer.registerStyleHook(function (node, textGroup) {
  const getDataOrStyle = name => node.getData(name) || node.getStyle(name)
  const color = getDataOrStyle('color')
  const fontSize = getDataOrStyle('font-size') + 'px'
  const fontFamily = getDataOrStyle('font-family') || "微软雅黑, 'Microsoft YaHei'"
  const lineHeight = getDataOrStyle('line-height')
  const fontStyle = getDataOrStyle('font-style')
  const fontWeight = getDataOrStyle('font-weight')
  const textDecoration = getDataOrStyle('text-decoration')
  const textAlign = getDataOrStyle('text-align')

  textGroup.foreign.setStyle({
    color,
    fontSize,
    fontFamily,
    lineHeight,
    fontStyle,
    fontWeight,
    textDecoration,
    textAlign
  })
})

Module.register('fontModule', function () {
  const km = this
  // 计算相同值
  const calculatorSame = key => {
    const nodes = km.getSelectedNodes()
    const array = Array.from(nodes, node => node.getData(key) || node.getStyle(key)).filter(Boolean)
    const flag = new Set(array).size === 1
    return flag ? nodes[0].getData(key) || nodes[0].getStyle(key) : ''
  }
  return {
    commands: {
      /**
       * @command ForeColor
       * @description 设置选中节点的字体颜色
       * @param {string} color 表示颜色的字符串
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       * @return 如果只有一个节点选中，返回已选中节点的字体颜色；否则返回 ''。
       */
      color: kity.createClass('fontColorCommand', {
        base: Command,
        execute(km, color) {
          const nodes = km.getSelectedNodes()
          nodes.forEach(function (n) {
            n.setData('color', color)
            n.render()
          })
        },
        queryState(km) {
          return km.getSelectedNode() ? 0 : -1
        },
        queryValue() {
          return calculatorSame('color')
        }
      }),

      /**
       * @command Background
       * @description 设置选中节点的背景颜色
       * @param {string} color 表示颜色的字符串
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       * @return 如果只有一个节点选中，返回已选中节点的背景颜色；否则返回 ''。
       */
      background: kity.createClass('backgroundCommand', {
        base: Command,

        execute(km, color) {
          const nodes = km.getSelectedNodes()
          nodes.forEach(function (n) {
            n.setData('background', color)
            n.render()
          })
        },
        queryState(km) {
          return km.getSelectedNode ? 0 : -1
        },
        queryValue() {
          return calculatorSame('background')
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
      family: kity.createClass('fontFamilyCommand', {
        base: Command,

        execute(km, family) {
          const nodes = km.getSelectedNodes()
          nodes.forEach(function (n) {
            n.setData('font-family', family)
            n.render()
          })
          km.layout()
        },
        queryState(km) {
          return km.getSelectedNodes().length === 0 ? -1 : 0
        },
        queryValue(km) {
          const nodes = km.getSelectedNodes() || []
          if (nodes.length === 1) return nodes[0].getData('font-family')
          return ''
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
      fontsize: kity.createClass('fontSizeCommand', {
        base: Command,

        execute(km, size) {
          const nodes = km.getSelectedNodes()
          nodes.forEach(function (n) {
            n.setData('font-size', size)
            n.render()
          })
          km.layout(300)
        },
        queryState(km) {
          return km.getSelectedNode() ? 0 : -1
        },
        queryValue() {
          return calculatorSame('font-size')
        }
      }),
      /**
       * @command ForeColor
       * @description 设置选中节点的字体颜色
       * @param {string} color 表示颜色的字符串
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       * @return 如果只有一个节点选中，返回已选中节点的字体颜色；否则返回 ''。
       */
      'text-align': kity.createClass('textAlginCommand', {
        base: Command,

        execute(km, value) {
          const nodes = km.getSelectedNodes()
          nodes.forEach(function (n) {
            n.setData('text-align', value).render()
          })
        },
        queryState(km) {
          return km.getSelectedNode() ? 0 : -1
        },
        queryValue() {
          return calculatorSame('text-align') || 'left'
        }
      }),
      /**
       * @command ClearStyle
       * @description 清除样式
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       */
      'clear-style': kity.createClass('clearStyleCommand', {
        base: Command,

        execute(km) {
          const nodes = km.getSelectedNodes()
          nodes.forEach(function (n) {
            n.setData('color')
            n.setData('font-size')
            n.setData('font-weight')
            n.setData('font-style')
            n.setData('text-decoration')
            n.setData('text-align')
            n.setData('background')
            n.render()
          })
          km.layout(300)
        },
        queryState(km) {
          return km.getSelectedNode() ? 0 : -1
        }
      }),
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

        execute(km) {
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
        queryState() {
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
        },
        queryValue() {
          return calculatorSame('font-weight')
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

        execute(km) {
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
        queryState() {
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
        },
        queryValue() {
          return calculatorSame('font-style')
        }
      }),
      /**
       * @command LineThough
       * @description 删除线
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       *   1: 当前已选中的节点已加删除线
       */
      'line-through': kity.createClass('lineThroughCommand', {
        base: Command,

        execute(km) {
          const nodes = km.getSelectedNodes()
          if (this.queryState('linethrough') === 1) {
            nodes.forEach(function (n) {
              n.setData('text-decoration').render()
            })
          } else {
            nodes.forEach(function (n) {
              n.setData('text-decoration', 'line-through').render()
            })
          }

          km.layout()
        },
        queryState() {
          const nodes = km.getSelectedNodes()
          let result = 0
          if (nodes.length === 0) {
            return -1
          }
          nodes.forEach(function (n) {
            if (n && n.getData('text-decoration') === 'line-through') {
              result = 1
              return false
            }
          })
          return result
        },
        queryValue() {
          return calculatorSame('text-decoration')
        }
      }),
      /**
       * @command Underline
       * @description 下划线
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       *   1: 当前已选中的节点已加下划线
       */
      underline: kity.createClass('underlineCommand', {
        base: Command,

        execute(km) {
          const nodes = km.getSelectedNodes()
          if (this.queryState('underline') === 1) {
            nodes.forEach(function (n) {
              n.setData('text-decoration').render()
            })
          } else {
            nodes.forEach(function (n) {
              n.setData('text-decoration', 'underline').render()
            })
          }

          km.layout()
        },
        queryState() {
          const nodes = km.getSelectedNodes()
          let result = 0
          if (nodes.length === 0) {
            return -1
          }
          nodes.forEach(function (n) {
            if (n && n.getData('text-decoration') === 'underline') {
              result = 1
              return false
            }
          })
          return result
        },
        queryValue() {
          return calculatorSame('text-decoration')
        }
      })
    },
    commandShortcutKeys: {
      bold: 'normal::ctrl+b|normal::command+b', //bold
      italic: 'normal::ctrl+i|normal::command+i' //italic
    }
  }
})
