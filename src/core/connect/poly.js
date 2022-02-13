/**
 * 提供折线相连的方法
 */
import connect from '../core/connect'

connect.register('poly', function (node, parent, connection, width) {
  console.log('width: ', width)
  // 连线起点和终点
  const po = parent.getLayoutVertexOut()
  const pi = node.getLayoutVertexIn()

  // 连线矢量和方向
  const v = parent.getLayoutVectorOut().normalize()

  const r = Math.round
  const abs = Math.abs

  const pathData = []
  pathData.push('M', r(po.x), r(po.y))

  switch (true) {
    case abs(v.x) > abs(v.y) && v.x < 0:
      // left
      pathData.push('h', -parent.getStyle('margin-left'))
      pathData.push('v', pi.y - po.y)
      pathData.push('H', pi.x)
      break

    case abs(v.x) > abs(v.y) && v.x >= 0:
      // right
      pathData.push('h', parent.getStyle('margin-right'))
      pathData.push('v', pi.y - po.y)
      pathData.push('H', pi.x)
      break

    case abs(v.x) <= abs(v.y) && v.y < 0:
      // top
      pathData.push('v', -parent.getStyle('margin-top'))
      pathData.push('h', pi.x - po.x)
      pathData.push('V', pi.y)
      break

    case abs(v.x) <= abs(v.y) && v.y >= 0:
      // bottom
      pathData.push('v', parent.getStyle('margin-bottom'))
      pathData.push('h', pi.x - po.x)
      pathData.push('V', pi.y)
      break
  }

  connection.setMarker(null)
  connection.setPathData(pathData)
})