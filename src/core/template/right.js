/**
 * 往右布局结构模板
 */
import template from '../core/template'

template.register('right', {
  getLayout(node) {
    return node.getData('layout') || 'right'
  },

  getConnect(node) {
    if (node.getLevel() === 1) return 'arc'
    // return 'bezier'
    return 'poly'
  }
})
