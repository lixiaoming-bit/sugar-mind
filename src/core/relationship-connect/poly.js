/**
 * 提供折线相连的方法
 */
import connect from '../core/relationship'
const kity = window.kity

connect.register('poly', function (end, start, connection, marker, points, type) {
  // 如果连线是用户操作 直接
  // const [startPo, startControl] = startPoint
  // const [endPo, endControl] = endPoint

  const pathData = []

  const { round: r, abs } = Math
  const startBox = start.getLayoutBox()
  const endBox = end.getLayoutBox()
  const startCenterPoint = new kity.Point(startBox.cx, startBox.cy)
  const endCenterPoint = new kity.Point(endBox.cx, endBox.cy)

  if (type === 'user') {
    const target = new kity.Path()
    const drawer = target.getDrawer()
    const startPoint = startCenterPoint.offset(points[0])
    const startControlPoint = startCenterPoint.offset(points[1])
    const endPoint = endCenterPoint.offset(points[2])
    const endControlPoint = endCenterPoint.offset(points[3])
    drawer
      .moveTo(startPoint.x, startPoint.y)
      .bezierTo(
        startControlPoint.x,
        startControlPoint.y,
        endControlPoint.x,
        endControlPoint.y,
        endPoint.x,
        endPoint.y
      )
    const pathData = target.getPathData()

    connection.setMarker(marker, 'start')
    connection.setPathData(pathData)

    return points
  }

  const deltaX = abs(startBox.left - endBox.left) | 1
  const deltaY = abs(startBox.top - endBox.top) | 1
  const isHor = deltaX <= 200
  const isVer = deltaY <= 200
  const offset = 70

  let po, pi, sp, ep, signX, signY

  const isSameDirection = (isHor && isVer) || deltaX <= 100 || deltaY <= 100

  // start end 同向
  if (isSameDirection) {
    // 水平方向同向
    if (deltaX <= deltaY) {
      const dir = abs(startBox.x) > abs(startBox.y) && startBox.x >= 0 ? 'right' : 'left'
      signX = dir === 'left' ? -1 : 1

      po = new kity.Point(startBox[dir], startBox.cy)
      pi = new kity.Point(endBox[dir], endBox.cy)

      sp = new kity.Point(po.x + signX * offset, po.y)
      ep = new kity.Point(pi.x + signX * offset, pi.y)

      pathData.push('M', r(po.x), r(po.y))
      pathData.push('C', sp.x, sp.y, ep.x, ep.y, pi.x, pi.y)
    }
    // 竖直方向同向
    else {
      const dir = abs(startBox.x) <= abs(startBox.y) && startBox.y >= 0 ? 'bottom' : 'top'
      signY = dir === 'top' ? -1 : 1

      po = new kity.Point(startBox.cx, startBox[dir])
      pi = new kity.Point(endBox.cx, endBox[dir])

      sp = new kity.Point(po.x, po.y + signY * offset)
      ep = new kity.Point(pi.x, pi.y + signY * offset)

      pathData.push('M', r(po.x), r(po.y))
      pathData.push('C', sp.x, sp.y, ep.x, ep.y, pi.x, pi.y)
    }
  }
  // start end 内部连接
  else {
    // 水平方向上 start 在 end的左侧
    const isLeft = startBox.left <= endBox.left
    signX = isLeft ? 1 : -1
    if (isLeft) {
      po = new kity.Point(startBox['right'], startBox.cy)
      pi = new kity.Point(endBox['left'], endBox.cy)
    }
    // 右侧
    else {
      po = new kity.Point(startBox['left'], startBox.cy)
      pi = new kity.Point(endBox['right'], endBox.cy)
    }

    const isTop = startBox.top <= endBox.top
    signY = isTop ? 1 : -1

    // 竖直方向上 start 在 end的上侧
    if (isTop) {
      po = po.offset(0, abs(startBox.height) / 2)
      pi = pi.offset(0, -abs(endBox.height) / 2)
    }
    // 下侧
    else {
      po = po.offset(0, -abs(startBox.height) / 2)
      pi = pi.offset(0, abs(endBox.height) / 2)
    }

    console.log(signX, signY)

    sp = new kity.Point(po.x + signX * offset, po.y + signY * offset)
    ep = new kity.Point(pi.x - signX * offset, pi.y - signY * offset)

    pathData.push('M', r(po.x), r(po.y))
    pathData.push('C', sp.x, sp.y, ep.x, ep.y, pi.x, pi.y)

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

  // 计算相对位置偏移的点
  const startPoint = kity.Vector.fromPoints(startCenterPoint, new kity.Point(po.x, po.y))
  const endPoint = kity.Vector.fromPoints(endCenterPoint, new kity.Point(pi.x, pi.y))

  const startControlPoint = kity.Vector.fromPoints(startCenterPoint, new kity.Point(sp.x, sp.y))

  const endControlPoint = kity.Vector.fromPoints(endCenterPoint, new kity.Point(ep.x, ep.y))

  return [startPoint, startControlPoint, endPoint, endControlPoint]
})
