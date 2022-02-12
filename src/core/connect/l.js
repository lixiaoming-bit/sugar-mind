/**
 * "L" 连线
 */
import connect from '../core/connect'

connect.register('l', function (node, parent, connection) {
  const po = parent.getLayoutVertexOut()
  const pi = node.getLayoutVertexIn()
  const vo = parent.getLayoutVectorOut()

  const pathData = []
  const r = Math.round,
    abs = Math.abs

  pathData.push('M', po.round())
  if (abs(vo.x) > abs(vo.y)) {
    pathData.push('H', r(pi.x))
  } else {
    pathData.push('V', pi.y)
  }
  pathData.push('L', pi)

  connection.setPathData(pathData)
})
