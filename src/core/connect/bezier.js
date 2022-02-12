/**
 * 提供折线相连的方法
 */
import connect from '../core/connect'

connect.register('bezier', function (node, parent, connection) {
  // 连线起点和终点
  const po = parent.getLayoutVertexOut()
  const pi = node.getLayoutVertexIn()

  // 连线矢量和方向
  const v = parent.getLayoutVectorOut().normalize()

  const r = Math.round
  const abs = Math.abs

  const pathData = []
  pathData.push('M', r(po.x), r(po.y))

  if (abs(v.x) > abs(v.y)) {
    // x - direction
    const hx = (pi.x + po.x) / 2
    pathData.push('C', hx, po.y, hx, pi.y, pi.x, pi.y)
  } else {
    // y - direction
    const hy = (pi.y + po.y) / 2
    pathData.push('C', po.x, hy, pi.x, hy, pi.x, pi.y)
  }

  connection.setMarker(null)
  connection.setPathData(pathData)
})
