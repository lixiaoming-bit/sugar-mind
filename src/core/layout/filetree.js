import Layout from '../core/layout'
const kity = window.kity

;[-1, 1].forEach(registerLayoutForDir)

function registerLayoutForDir(dir) {
  const name = 'filetree-' + (dir > 0 ? 'down' : 'up')

  Layout.register(
    name,
    kity.createClass({
      base: Layout,

      doLayout: function (parent, children) {
        const pBox = parent.getContentBox()
        const indent = 20

        parent.setVertexOut(
          new kity.Point(
            pBox.left + indent,
            dir > 0
              ? pBox.bottom + parent.getStyle('padding-bottom')
              : pBox.top + parent.getStyle('padding-top')
          )
        )
        parent.setLayoutVectorOut(new kity.Vector(0, dir))

        if (!children.length) return

        children.forEach(function (child) {
          const cBox = child.getContentBox()
          child.setLayoutTransform(new kity.Matrix())

          child.setVertexIn(new kity.Point(cBox.left, cBox.cy))
          child.setLayoutVectorIn(new kity.Vector(1, 0))
        })

        this.align(children, 'left')
        this.stack(children, 'y')

        let xAdjust = 0
        xAdjust += pBox.left
        xAdjust += indent
        xAdjust += children[0].getStyle('margin-left')

        let yAdjust = 0

        if (dir > 0) {
          yAdjust += pBox.bottom
          yAdjust += parent.getStyle('margin-bottom')
          yAdjust += children[0].getStyle('margin-top')
        } else {
          yAdjust -= this.getTreeBox(children).bottom
          yAdjust += pBox.top
          yAdjust -= parent.getStyle('margin-top')
          yAdjust -= children[0].getStyle('margin-bottom')
        }

        this.move(children, xAdjust, yAdjust)
      },

      getOrderHint: function (node) {
        const hint = []
        const box = node.getLayoutBox()
        const offset = node.getLevel() > 1 ? 3 : 5

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
}
