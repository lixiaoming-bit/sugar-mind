/**
 * 组织结构图模板
 */
import template from '../core/template'

template.register('structure', {
  getLayout(node) {
    return node.getData('layout') || 'bottom'
  },

  getConnect() {
    return 'poly'
  }
})
