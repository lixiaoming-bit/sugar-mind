/**
 * 文件夹模板
 */
import template from '../core/template'

template.register('filetree', {
  getLayout(node) {
    if (node.getData('layout')) return node.getData('layout')
    if (node.isRoot()) return 'bottom'

    return 'filetree-down'
  },

  getConnect(node) {
    if (node.getLevel() === 1) {
      return 'poly'
    }
    return 'l'
  }
})
