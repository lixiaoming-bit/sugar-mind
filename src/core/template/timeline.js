/**
 * 默认模板 - 时间轴模板
 */
import template from '../core/template'

template.register('timeline', {
  getLayout(node) {
    if (node.getData('layout')) return node.getData('layout')

    const level = node.getLevel()

    // 根节点
    if (level === 0) {
      return 'fish-bone-master'
    }

    // 一级节点
    if (level === 1) {
      return 'fish-bone-slave'
    }

    //  return node.getLayoutPointPreview().y > 0 ? 'filetree-up' : 'filetree-down'
    return 'right'
  },

  getConnect(node) {
    switch (node.getLevel()) {
      case 1:
        return 'fish-bone-master'
      case 2:
        return 'l'
      default:
        return 'l'
    }
  }
})
