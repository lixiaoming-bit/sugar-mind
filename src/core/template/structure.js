/**
 * 组织结构图模板
 */
import template from '../core/template'

template.register('structure', {
  getLayout: function (node) {
    return node.getData('layout') || 'bottom'
  },

  getConnect: function () {
    return 'poly'
  }
})
