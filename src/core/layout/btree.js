import Layout from '../core/layout'
const kity = window.kity

;['left', 'right', 'top', 'bottom'].forEach(registerLayoutForDirection)

function registerLayoutForDirection(name) {
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
    name,
    kity.createClass({
      base: Layout,

      doLayout(parent, children) {
        const pBox = parent.getContentBox()

        if (axis === 'x') {
          parent.setVertexOut(new kity.Point(pBox[name], pBox.cy))
          parent.setLayoutVectorOut(new kity.Vector(dir, 0))
        } else {
          parent.setVertexOut(new kity.Point(pBox.cx, pBox[name]))
          parent.setLayoutVectorOut(new kity.Vector(0, dir))
        }

        if (!children.length) {
          return false
        }

        children.forEach(function (child) {
          const cBox = child.getContentBox()
          child.setLayoutTransform(new kity.Matrix())

          if (axis === 'x') {
            child.setVertexIn(new kity.Point(cBox[opposite[name]], cBox.cy))
            child.setLayoutVectorIn(new kity.Vector(dir, 0))
          } else {
            child.setVertexIn(new kity.Point(cBox.cx, cBox[opposite[name]]))
            child.setLayoutVectorIn(new kity.Vector(0, dir))
          }
        })

        this.align(children, opposite[name])
        this.stack(children, opposite[axis])

        const bBox = this.getBranchBox(children)
        let xAdjust = 0
        let yAdjust = 0

        if (axis === 'x') {
          xAdjust = pBox[name]
          xAdjust += dir * parent.getStyle('margin-' + name)
          xAdjust += dir * children[0].getStyle('margin-' + opposite[name])

          yAdjust = pBox.bottom
          yAdjust -= pBox.height / 2
          yAdjust -= bBox.height / 2
          yAdjust -= bBox.y
        } else {
          xAdjust = pBox.right
          xAdjust -= pBox.width / 2
          xAdjust -= bBox.width / 2
          xAdjust -= bBox.x

          yAdjust = pBox[name]
          yAdjust += dir * parent.getStyle('margin-' + name)
          yAdjust += dir * children[0].getStyle('margin-' + opposite[name])
        }

        this.move(children, xAdjust, yAdjust)
      },

      getOrderHint: getOrderHint
    })
  )
}
