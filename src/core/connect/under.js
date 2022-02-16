/**
 *
 * 下划线连线
 *
 */
import connect from '../core/connect'
const kity = window.kity

connect.register('under', function (node, parent, connection) {
  const box = node.getLayoutBox()
  const pBox = parent.getLayoutBox()

  const pathData = []
  const side = box.x > pBox.x ? 'right' : 'left'

  // const radius = node.getStyle('connect-radius')
  const underY = box.bottom + 3
  const startY = parent.getType() === 'sub' ? pBox.bottom + 3 : pBox.cy
  let p1
  let p2
  let p3
  let mx

  if (side === 'right') {
    p1 = new kity.Point(pBox.right, startY)
    p2 = new kity.Point(box.left - 10, underY)
    p3 = new kity.Point(box.right, underY)
  } else {
    p1 = new kity.Point(pBox.left, startY)
    p2 = new kity.Point(box.right + 10, underY)
    p3 = new kity.Point(box.left, underY)
  }

  mx = (p1.x + p2.x) / 2

  pathData.push('M', p1)
  pathData.push('C', mx, p1.y, mx, p2.y, p2)
  pathData.push('L', p3)

  connection.setMarker(null)

  connection.setPathData(pathData)
})
