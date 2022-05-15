/**
 * @description 设置不同类型的popover, 这里控制popover的显示与隐藏策略
 */
import Command from '../core/command'
import Module from '../core/module'

const kity = window.kity

Module.register('PopoverControlCommand', function () {
  /**
   * @command PopoverControl
   * @description 设置popover的显示与隐藏
   * @param {string} 设置popover的类型
   * @state
   *    0: 当前有选中的节点
   *   -1: 当前没有选中的节点
   */
  const OpenPopoverCommand = kity.createClass('OpenPopoverCommand', {
    base: Command,

    execute(minder, type) {
      minder.fire('openpopoverrequest', { popoverType: type })
    },

    queryState(minder) {
      return minder.getSelectedNode() && minder.getStatus() !== 'readonly' ? 0 : -1
    }
  })
  return {
    commands: {
      OpenPopover: OpenPopoverCommand
    }
  }
})
