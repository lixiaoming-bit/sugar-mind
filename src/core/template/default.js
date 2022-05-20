/**
 * 默认模板 - 脑图模板
 */
import template from '../core/template'
template.register('default', {
  getLayout(node) {
    if (node.getData('layout')) return node.getData('layout')

    const level = node.getLevel()

    // 根节点
    if (level === 0) {
      return 'mind'
    }

    // 一级节点
    if (level === 1) {
      return node.getLayoutPointPreview().x > 0 ? 'right' : 'left'
    }

    // console.log('node.getData', node.getData('text'), node.parent.getLayout())
    return node.parent.getLayout()
  },

  getConnect(node) {
    if (node.type === 'summary') return 'arc_sum'
    if (node.getLevel() === 1) return 'arc'
    return 'poly'
  }
})
