import Layout from '../core/layout'
const kity = window.kity

Layout.register(
  'fish-bone-slave',
  kity.createClass('FishBoneSlaveLayout', {
    base: Layout,

    doLayout: function (parent, children, round) {
      const layout = this
      const abs = Math.abs
      const GOLD_CUT = 1 - 0.618

      const pBox = parent.getContentBox()
      const vi = parent.getLayoutVectorIn()

      parent.setLayoutVectorOut(vi)

      const goldX = pBox.left + pBox.width * GOLD_CUT
      const pout = new kity.Point(goldX, vi.y > 0 ? pBox.bottom : pBox.top)
      parent.setVertexOut(pout)

      const child = children[0]
      if (!child) return

      const cBox = child.getContentBox()

      children.forEach(function (child) {
        child.setLayoutTransform(new kity.Matrix())
        child.setLayoutVectorIn(new kity.Vector(1, 0))
        child.setVertexIn(new kity.Point(cBox.left, cBox.cy))
      })

      this.stack(children, 'y')
      this.align(children, 'left')

      let xAdjust = 0
      let yAdjust = 0
      xAdjust += pout.x

      if (parent.getLayoutVectorOut().y < 0) {
        yAdjust -= this.getTreeBox(children).bottom
        yAdjust += parent.getContentBox().top
        yAdjust -= parent.getStyle('margin-top')
        yAdjust -= child.getStyle('margin-bottom')
      } else {
        yAdjust += parent.getContentBox().bottom
        yAdjust += parent.getStyle('margin-bottom')
        yAdjust += child.getStyle('margin-top')
      }

      this.move(children, xAdjust, yAdjust)

      if (round === 2) {
        children.forEach(function (child) {
          const m = child.getLayoutTransform()
          const cBox = child.getContentBox()
          const pin = m.transformPoint(new kity.Point(cBox.left, 0))
          layout.move([child], abs(pin.y - pout.y), 0)
        })
      }
    }
  })
)
