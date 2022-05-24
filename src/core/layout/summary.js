import Layout from '../core/layout'
const kity = window.kity

;['sumLeft', 'sumRight', 'sumTop', 'sumBottom'].forEach(registerLayoutForDirection)

function registerLayoutForDirection(layoutName) {
  const name = layoutName.substring(3).toLowerCase()
  const axis = name === 'left' || name === 'right' ? 'x' : 'y'
  const dir = name === 'left' || name === 'top' ? -1 : 1

  const opposite = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
    x: 'y',
    y: 'x'
  }

  function getOrderHint(node) {
    const hint = []
    const box = node.getLayoutBox()
    let offset = 5

    if (axis === 'x') {
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
    } else {
      hint.push({
        type: 'up',
        node: node,
        area: new kity.Box({
          x: box.left - node.getStyle('margin-left') - offset,
          y: box.top,
          width: node.getStyle('margin-left'),
          height: box.height
        }),
        path: ['M', box.left - offset, box.top, 'L', box.left - offset, box.bottom]
      })

      hint.push({
        type: 'down',
        node: node,
        area: new kity.Box({
          x: box.right + offset,
          y: box.top,
          width: node.getStyle('margin-right'),
          height: box.height
        }),
        path: ['M', box.right + offset, box.top, 'L', box.right + offset, box.bottom]
      })
    }
    return hint
  }

  Layout.register(
    layoutName,
    kity.createClass({
      base: Layout,

      doLayout(parent, children) {
        if (!children.length) {
          return false
        }
        children.forEach(child => {
          let tBox = this.getSummaryBox(child)
          const virParent = parent.getChildren()[child.data.startIndex]
          const bBox = child.getContentBox()
          child.setLayoutTransform(new kity.Matrix())

          if (axis === 'x') {
            child.setVertexIn(new kity.Point(bBox[opposite[name]], bBox.cy))
            child.setLayoutVectorIn(new kity.Vector(dir, 0))
          }
          this.align([child], opposite[name])
          let xAdjust = 0
          let yAdjust = 0
          if (axis === 'x') {
            xAdjust = tBox[name]
            xAdjust += dir * virParent.getStyle('margin-' + name)
            xAdjust += dir * child.getStyle('margin-' + opposite[name])

            yAdjust = tBox.bottom
            yAdjust -= tBox.height / 2
            yAdjust -= bBox.height / 2
            yAdjust -= bBox.y
          }

          this.move([child], xAdjust, yAdjust)
        })
      },

      getOrderHint: getOrderHint
    })
  )
}
