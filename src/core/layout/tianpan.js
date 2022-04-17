/**
 * 天盘模板
 */
import Layout from '../core/layout'
const kity = window.kity

Layout.register(
  'tianpan',
  kity.createClass({
    base: Layout,

    doLayout(parent, children) {
      if (children.length === 0) return

      const layout = this
      const pBox = parent.getContentBox()

      let x
      let y
      let box
      let _theta = 5
      let _r = Math.max(pBox.width, 50)
      children.forEach(function (child) {
        child.setLayoutTransform(new kity.Matrix())
        box = layout.getTreeBox(child)
        _r = Math.max(Math.max(box.width, box.height), _r)
      })
      _r = _r / 1.5 / Math.PI

      children.forEach(function (child, index) {
        x = _r * (Math.cos(_theta) + Math.sin(_theta) * _theta)
        y = _r * (Math.sin(_theta) - Math.cos(_theta) * _theta)

        _theta += 0.9 - index * 0.02
        child.setLayoutVectorIn(new kity.Vector(1, 0))
        child.setVertexIn(new kity.Point(pBox.cx, pBox.cy))
        child.setLayoutTransform(new kity.Matrix())
        layout.move([child], x, y)
      })
    },

    getOrderHint(node) {
      const hint = []
      const box = node.getLayoutBox()
      const offset = 5

      hint.push({
        type: 'up',
        node: node,
        area: {
          x: box.x,
          y: box.top - node.getStyle('margin-top') - offset,
          width: box.width,
          height: node.getStyle('margin-top')
        },
        path: ['M', box.x, box.top - offset, 'L', box.right, box.top - offset]
      })

      hint.push({
        type: 'down',
        node: node,
        area: {
          x: box.x,
          y: box.bottom + offset,
          width: box.width,
          height: node.getStyle('margin-bottom')
        },
        path: ['M', box.x, box.bottom + offset, 'L', box.right, box.bottom + offset]
      })
      return hint
    }
  })
)
