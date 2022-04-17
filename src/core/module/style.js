import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

Module.register('StyleModule', function () {
  const styleNames = [
    'font-size',
    'font-family',
    'font-weight',
    'font-style',
    'background',
    'color'
  ]
  let styleClipBoard = null

  function hasStyle(node) {
    const getDataOrStyle = name => node.getData(name) || node.getStyle(name)
    return styleNames.some(name => getDataOrStyle(name))
  }

  return {
    commands: {
      /**
       * @command CopyStyle
       * @description 拷贝选中节点的当前样式，包括字体、字号、粗体、斜体、背景色、字体色
       * @state
       *   0: 当前有选中的节点
       *  -1: 当前没有选中的节点
       */
      copystyle: kity.createClass('CopyStyleCommand', {
        base: Command,

        execute(minder) {
          const node = minder.getSelectedNode()

          const getDataOrStyle = name => node.getData(name) || node.getStyle(name)

          styleClipBoard = {}
          styleNames.forEach(function (name) {
            const style = getDataOrStyle(name)
            if (style) styleClipBoard[name] = style
            else {
              styleClipBoard[name] = null
              delete styleClipBoard[name]
            }
          })
          this.setContentChanged(false)
          return styleClipBoard
        },

        queryState(minder) {
          const nodes = minder.getSelectedNodes()
          if (nodes.length !== 1) return -1
          return hasStyle(nodes[0]) ? 0 : -1
        }
      }),

      /**
       * @command PasteStyle
       * @description 粘贴已拷贝的样式到选中的节点上，包括字体、字号、粗体、斜体、背景色、字体色
       * @state
       *   0: 当前有选中的节点，并且已经有复制的样式
       *  -1: 当前没有选中的节点，或者没有复制的样式
       */
      pastestyle: kity.createClass('PastStyleCommand', {
        base: Command,

        execute(minder) {
          minder.getSelectedNodes().forEach(function (node) {
            for (const name in styleClipBoard) {
              if (Object.hasOwnProperty.call(styleClipBoard, name))
                node.setData(name, styleClipBoard[name])
            }
          })
          minder.renderNodeBatch(minder.getSelectedNodes())
          minder.layout(300)
          return styleClipBoard
        },

        queryState(minder) {
          return styleClipBoard && minder.getSelectedNodes().length ? 0 : -1
        }
      }),

      /**
       * @command ClearStyle
       * @description 移除选中节点的样式，包括字体、字号、粗体、斜体、背景色、字体色
       * @state
       *   0: 当前有选中的节点，并且至少有一个设置了至少一种样式
       *  -1: 其它情况
       */
      clearstyle: kity.createClass('ClearStyleCommand', {
        base: Command,
        execute(minder) {
          minder.getSelectedNodes().forEach(function (node) {
            styleNames.forEach(function (name) {
              node.setData(name)
            })
          })
          minder.renderNodeBatch(minder.getSelectedNodes())
          minder.layout(300)
          return styleClipBoard
        },

        queryState(minder) {
          const nodes = minder.getSelectedNodes()
          if (!nodes.length) return -1
          for (let i = 0; i < nodes.length; i++) {
            if (hasStyle(nodes[i])) return 0
          }
          return -1
        }
      })
    }
  }
})
