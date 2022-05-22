/**
 * 提供折线相连的方法
 */
import connect from '../core/relationship'
const kity = window.kity

connect.register('poly', function (end, start, connection, marker) {
  const pathData = []

  const { round: r, abs } = Math
  const startBox = start.getLayoutBox()
  const endBox = end.getLayoutBox()

  const deltaX = abs(startBox.left - endBox.left) | 1
  const deltaY = abs(startBox.top - endBox.top) | 1
  const isHor = deltaX <= 200
  const isVer = deltaY <= 200

  const isSameDirection = (isHor && isVer) || deltaX <= 100 || deltaY <= 100

  // start end 同向
  if (isSameDirection) {
    // 水平方向同向
    if (deltaX <= deltaY) {
      const offset = 70

      const dir = abs(startBox.x) > abs(startBox.y) && startBox.x >= 0 ? 'right' : 'left'
      const sign = dir === 'left' ? -1 : 1

      const po = new kity.Point(startBox[dir], startBox.cy).offset(sign * 5, 0)
      const pi = new kity.Point(endBox[dir], endBox.cy).offset(sign * 5, 0)

      pathData.push('M', r(po.x), r(po.y))
      pathData.push('C', po.x + sign * offset, po.y, pi.x + sign * offset, pi.y, pi.x, pi.y)
    }
    // 竖直方向同向
    else {
      const offset = 70

      const dir = abs(startBox.x) <= abs(startBox.y) && startBox.y >= 0 ? 'bottom' : 'top'
      const sign = dir === 'top' ? -1 : 1

      const po = new kity.Point(startBox.cx, startBox[dir]).offset(0, sign * 5)
      const pi = new kity.Point(endBox.cx, endBox[dir]).offset(0, sign * 5)

      pathData.push('M', r(po.x), r(po.y))
      pathData.push('C', po.x, po.y + sign * offset, pi.x, pi.y + sign * offset, pi.x, pi.y)
    }
  }
  // start end 内部连接
  else {
    let po, pi, signX, signY
    const offsetX = 50
    const offsetY = 100
    // 水平方向上 start 在 end的左侧
    if (startBox.left <= endBox.left) {
      signX = 1
      po = new kity.Point(startBox['right'], startBox.cy)
      pi = new kity.Point(endBox['left'], endBox.cy)
    }
    // 右侧
    else {
      signX = -1
      po = new kity.Point(startBox['left'], startBox.cy)
      pi = new kity.Point(endBox['right'], endBox.cy)
    }

    // 竖直方向上 start 在 end的上侧
    if (startBox.top <= endBox.top) {
      signY = 1
      po = po.offset(0, abs(startBox.height) / 2)
      pi = pi.offset(0, -abs(endBox.height) / 2)
    }
    // 下侧
    else {
      signY = -1
      po = po.offset(0, -abs(startBox.height) / 2)
      pi = pi.offset(0, abs(endBox.height) / 2)
    }
    pathData.push('M', r(po.x), r(po.y))
    pathData.push(
      'C',
      po.x + signX * offsetX,
      po.y + signY * offsetY,
      pi.x - signX * offsetX,
      pi.y - signY * offsetY,
      pi.x,
      pi.y
    )

    // const box = startBox.merge(endBox)
    // console.log('box: ', box)
    // // pathData.push('M', r(box.left), r(box.top))
    // const points = [
    //   new kity.ShapePoint(box.left, box.top),
    //   new kity.ShapePoint(box.right, box.top),
    //   new kity.ShapePoint(box.right, box.bottom),
    //   new kity.ShapePoint(box.left, box.bottom)
    // ]
    // const curve = new kity.Curve(points).fill('none').stroke('black').setSmoothFactor(0.5)
    // console.log('curve.getPathData(): ', curve.getPathData())
  }
  connection.setMarker(marker, 'start')
  connection.setPathData(pathData)
})
