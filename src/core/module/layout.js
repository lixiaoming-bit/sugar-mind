// 布局模块

import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity

Module.register('LayoutModule', function () {
  /**
   * @command Layout
   * @description 设置选中节点的布局
   *     允许使用的布局可以使用 `kityminder.Minder.getLayoutList()` 查询
   * @param {string} name 布局的名称，设置为 null 则使用继承或默认的布局
   * @state
   *   0: 当前有选中的节点
   *  -1: 当前没有选中的节点
   * @return 返回首个选中节点的布局名称
   */
  const LayoutCommand = kity.createClass('LayoutCommand', {
    base: Command,

    execute(minder, name) {
      const nodes = minder.getSelectedNodes()
      nodes.forEach(function (node) {
        node.layout(name)
      })
      this.setContentChanged(false)
    },

    queryValue(minder) {
      const node = minder.getSelectedNode()
      if (node) {
        return node.getData('layout')
      }
    },

    queryState(minder) {
      return minder.getSelectedNode() ? 0 : -1
    }
  })

  /**
   * @command ResetLayout
   * @description 重设选中节点的布局，如果当前没有选中的节点，重设整个脑图的布局
   * @state
   *   0: 始终可用
   * @return 返回首个选中节点的布局名称
   */
  const ResetLayoutCommand = kity.createClass('ResetLayoutCommand', {
    base: Command,

    execute(minder) {
      let nodes = minder.getSelectedNodes()

      if (!nodes.length) nodes = [minder.getRoot()]

      nodes.forEach(function (node) {
        node.traverse(function (child) {
          child.resetLayoutOffset()
          if (!child.isRoot()) {
            child.setData('layout', null)
          }
        })
      })
      minder.layout(300)
      this.setContentChanged(false)
    },

    enableReadOnly: true
  })
  return {
    commands: {
      layout: LayoutCommand,
      resetlayout: ResetLayoutCommand
    },
    commandShortcutKeys: {
      resetlayout: 'normal::ctrl+shift+l|normal::command+shift+l'
    }
  }
})
