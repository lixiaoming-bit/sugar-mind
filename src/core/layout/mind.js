import Layout from '../core/layout'
import Minder from '../core/minder'
const kity = window.kity

Layout.register(
  'mind',
  kity.createClass({
    base: Layout,

    doLayout(node, children) {
      const right = []
      const left = []
      let part = []
      let data = []
      for (let i = 0; i < children.length; i++) {
        if (data.indexOf(children[i]) !== -1) continue
        if (children[i].isInSummary(children[i].parent).length) {
          data = children[i].getBindNode(children[i], children)
          part.push(data)
        } else {
          part.push([children[i]])
        }
      }
      const nHalf = Math.ceil(part.length / 2)
      part.forEach((e, index) => {
        if (index < nHalf) right.push(...e)
        else left.push(...e)
      })

      const leftLayout = Minder.getLayoutInstance('left')
      const rightLayout = Minder.getLayoutInstance('right')

      leftLayout.doLayout(node, left)
      rightLayout.doLayout(node, right)

      const box = node.getContentBox()
      node.setVertexOut(new kity.Point(box.cx, box.cy))
      node.setLayoutVectorOut(new kity.Vector(0, 0))
    },

    getOrderHint(node) {
      const hint = []
      const box = node.getLayoutBox()
      const offset = 5

      hint.push({
        type: 'up',
        node: node,
        area: new kity.Box({
          x: box.x,
          y: box.top - node.getStyle('margin-top') - offset,
          width: box.width,
          height: node.getStyle('margin-top')
        }),
        path: ['M', box.x, box.top - offset, 'L', box.right, box.top - offset]
      })

      hint.push({
        type: 'down',
        node: node,
        area: new kity.Box({
          x: box.x,
          y: box.bottom + offset,
          width: box.width,
          height: node.getStyle('margin-bottom')
        }),
        path: ['M', box.x, box.bottom + offset, 'L', box.right, box.bottom + offset]
      })
      return hint
    }
  })
)
