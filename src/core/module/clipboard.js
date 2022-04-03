import MinderNode from '../core/node'
import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

Module.register('ClipboardModule', function () {
  const km = this
  let _clipboardNodes = []
  let _selectedNodes = []

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
      // this.setContentChanged(false)
    },
    queryState: function (km) {
      return km.getSelectedNode() ? 0 : -1
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
    },
    queryState: function (km) {
      return km.getSelectedNode().isRoot() ? -1 : 0
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
        nodes.forEach(function (node) {
          // 由于粘贴逻辑中为了排除子节点重新排序导致逆序，因此复制的时候倒过来
          for (let i = 0; i <= _clipboardNodes.length - 1; i++) {
            const n = km.createNode(null, node)
            km.importNode(n, _clipboardNodes[i])
            _selectedNodes.push(n)
            node.appendChild(n)
          }
        })
        km.select(_selectedNodes, true)
        _selectedNodes = []

        km.refresh()
      }
    },

    queryState: function (km) {
      return km.getSelectedNode() && _clipboardNodes.length ? 0 : -1
    }
  })

  /**
   * @Desc: 若支持原生clipboadr事件则基于原生扩展，否则使用km的基础事件只处理节点的粘贴复制
   */
  if (km.supportClipboardEvent && !kity.Browser.gecko) {
    const Copy = function (e) {
      this.fire('customCopy', e)
    }

    const Cut = function (e) {
      this.fire('customCut', e)
    }

    const Paste = function (e) {
      this.fire('customPaste', e)
    }

    return {
      commands: {
        copy: CopyCommand,
        cut: CutCommand,
        paste: PasteCommand
      },
      clipBoardEvents: {
        copy: Copy.bind(km),
        cut: Cut.bind(km),
        paste: Paste.bind(km)
      }
      // sendToClipboard: sendToClipboard
    }
  } else {
    return {
      commands: {
        copy: CopyCommand,
        cut: CutCommand,
        paste: PasteCommand
      },
      commandShortcutKeys: {
        copy: 'normal::ctrl+c|',
        cut: 'normal::ctrl+x',
        paste: 'normal::ctrl+v'
      }
      // sendToClipboard: sendToClipboard
    }
  }
})
