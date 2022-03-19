/**
 * 往右布局结构模板
 */
import template from '../core/template'

template.register('right', {
  getLayout: function (node) {
    return node.getData('layout') || 'right'
  },

  getConnect: function (node) {
    if (node.getLevel() === 1) return 'arc'
    // return 'bezier'
    return 'poly'
  }
})
