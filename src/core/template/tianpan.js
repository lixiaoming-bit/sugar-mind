/**
 * 天盘模板
 */
import template from '../core/template'

template.register('tianpan', {
  getLayout(node) {
    if (node.getData('layout')) return node.getData('layout')
    const level = node.getLevel()

    // 根节点
    if (level === 0) {
      return 'tianpan'
    }

    return node.parent.getLayout()
  },

  getConnect() {
    return 'arc_tp'
  }
})
