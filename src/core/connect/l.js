/**
 * "L" 连线
 */
import connect from '../core/connect'

connect.register('l', function (node, parent, connection) {
  const po = parent.getLayoutVertexOut()
  const pi = node.getLayoutVertexIn()
  const vo = parent.getLayoutVectorOut()

  const pathData = []
  const r = Math.round
  const abs = Math.abs

  pathData.push('M', r(po.x) + 12, r(po.y))
  if (abs(vo.x) > abs(vo.y)) {
    pathData.push('H', r(pi.x))
  } else {
    pathData.push('V', pi.y)
  }
  pathData.push('L', pi)

  connection.setPathData(pathData)
})
