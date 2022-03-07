import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

Module.register('ClipboardModule', function () {
  const km = this
  let _clipboardNodes = []
  let _selectedNodes = []

  function appendChildNode(parent, child) {
    _selectedNodes.push(child)
    km.appendNode(child, parent)
    child.render()
    child.setLayoutOffset(null)
    const children = child.children.map(function (node) {
      return node.clone()
    })

    /*
     * 原因：粘贴递归 append 时没有清空原来父节点的子节点，而父节点被复制的时候，是连同子节点一起复制过来的
     * 解决办法：增加了下面这一行代码
     */
    child.clearChildren()

    for (var i = 0, ci; (ci = children[i]); i++) {
      appendChildNode(child, ci)
    }
  }

  function sendToClipboard(nodes) {
    if (!nodes.length) return
    nodes.sort(function (a, b) {
      return a.getIndex() - b.getIndex()
    })
    _clipboardNodes = nodes.map(function (node) {
      return node.clone()
    })
  }

  /**
   * @command Copy
   * @description 复制当前选中的节点
   * @shortcut ctrl + C
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   */
  const CopyCommand = kity.createClass('CopyCommand', {
    base: Command,

    execute: function (km) {
      sendToClipboard(km.getSelectedAncestors(true))
      this.setContentChanged(false)
    }
  })

  /**
   * @command Cut
   * @description 剪切当前选中的节点
   * @shortcut ctrl + X
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   */
  const CutCommand = kity.createClass('CutCommand', {
    base: Command,

    execute: function (km) {
      const ancestors = km.getSelectedAncestors()

      if (ancestors.length === 0) return

      sendToClipboard(ancestors)

      km.select(MinderNode.getCommonAncestor(ancestors), true)

      ancestors.slice().forEach(function (node) {
        km.removeNode(node)
      })

      km.layout(300)
    }
  })

  /**
   * @command Paste
   * @description 粘贴已复制的节点到每一个当前选中的节点上
   * @shortcut ctrl + V
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   */
  const PasteCommand = kity.createClass('PasteCommand', {
    base: Command,

    execute: function (km) {
      if (_clipboardNodes.length) {
        const nodes = km.getSelectedNodes()
        if (!nodes.length) return

        for (var i = 0, ni; (ni = _clipboardNodes[i]); i++) {
          for (var j = 0, node; (node = nodes[j]); j++) {
            appendChildNode(node, ni.clone())
          }
        }

        km.select(_selectedNodes, true)
        _selectedNodes = []

        km.layout(300)
      }
    },

    queryState: function (km) {
      return km.getSelectedNode() ? 0 : -1
    }
  })

  /**
   * @Desc: 若支持原生clipboadr事件则基于原生扩展，否则使用km的基础事件只处理节点的粘贴复制
   */
  // if (km.supportClipboardEvent && !kity.Browser.gecko) {
  //   const Copy = function (e) {
  //     this.fire('beforeCopy', e)
  //   }

  //   const Cut = function (e) {
  //     this.fire('beforeCut', e)
  //   }

  //   const Paste = function (e) {
  //     this.fire('beforePaste', e)
  //   }

  //   return {
  //     commands: {
  //       copy: CopyCommand,
  //       cut: CutCommand,
  //       paste: PasteCommand
  //     },
  //     clipBoardEvents: {
  //       copy: Copy.bind(km),
  //       cut: Cut.bind(km),
  //       paste: Paste.bind(km)
  //     },
  //     sendToClipboard: sendToClipboard
  //   }
  // } else {
  //   return {
  //     commands: {
  //       copy: CopyCommand,
  //       cut: CutCommand,
  //       paste: PasteCommand
  //     },
  //     commandShortcutKeys: {
  //       copy: 'normal::ctrl+c|',
  //       cut: 'normal::ctrl+x',
  //       paste: 'normal::ctrl+v'
  //     },
  //     sendToClipboard: sendToClipboard
  //   }
  // }
  return {
    commands: {
      copy: CopyCommand,
      cut: CutCommand,
      paste: PasteCommand
    },
    commandShortcutKeys: {
      copy: 'normal::ctrl|command+c|',
      cut: 'normal::ctrl|command+x',
      paste: 'normal::ctrl|command+v'
    },
    sendToClipboard: sendToClipboard
  }
})
