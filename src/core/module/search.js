/**
 * 支持节点的搜索操作
 */
import Command from '../core/command'
import Module from '../core/module'
const kity = window.kity
Module.register('SearchModule', function () {
  /**
   * @command Search
   * @description 触发节点的搜索
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const SearchCommand = kity.createClass('SearchCommand', {
    base: Command,

    execute: function (minder) {
      minder.fire('search')
    },
    enableReadOnly: true
  })

  return {
    commands: {
      search: SearchCommand
    },
    commandShortcutKeys: {
      search: 'ctrl+f|command+f'
    }
  }
})
