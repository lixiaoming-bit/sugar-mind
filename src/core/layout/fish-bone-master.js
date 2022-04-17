/**
 * 鱼骨图主骨架布局
 */

import Layout from '../core/layout'
const kity = window.kity

Layout.register(
  'fish-bone-master',
  kity.createClass('FishBoneMasterLayout', {
    base: Layout,

    doLayout(parent, children) {
      const upPart = []
      const downPart = []

      const child = children[0]
      const pBox = parent.getContentBox()

      parent.setVertexOut(new kity.Point(pBox.right, pBox.cy))
      parent.setLayoutVectorOut(new kity.Vector(1, 0))

      if (!child) return

      //   var cBox = child.getContentBox()
      const pMarginRight = parent.getStyle('margin-right')
      const cMarginLeft = child.getStyle('margin-left')
      const cMarginTop = child.getStyle('margin-top')
      const cMarginBottom = child.getStyle('margin-bottom')

      children.forEach(function (child, index) {
        child.setLayoutTransform(new kity.Matrix())
        const cBox = child.getContentBox()

        if (index % 2) {
          downPart.push(child)
          child.setVertexIn(new kity.Point(cBox.left, cBox.top))
          child.setLayoutVectorIn(new kity.Vector(1, 1))
        } else {
          upPart.push(child)
          child.setVertexIn(new kity.Point(cBox.left, cBox.bottom))
          child.setLayoutVectorIn(new kity.Vector(1, -1))
        }
      })

      this.stack(upPart, 'x')
      this.stack(downPart, 'x')

      this.align(upPart, 'bottom')
      this.align(downPart, 'top')

      const xAdjust = pBox.right + pMarginRight + cMarginLeft
      const yAdjustUp = pBox.cy - cMarginBottom - parent.getStyle('margin-top')
      const yAdjustDown = pBox.cy + cMarginTop + parent.getStyle('margin-bottom')

      this.move(upPart, xAdjust, yAdjustUp)
      this.move(downPart, xAdjust + cMarginLeft, yAdjustDown)
    }
  })
)
