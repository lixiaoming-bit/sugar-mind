/**
 * 提供折线相连的方法
 */
import connect from '../core/connect'

connect.register('poly', function (node, parent, connection) {
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
      var leftX = po.x - parent.getStyle('margin-left')
      var leftY = pi.y - po.y
      pathData.push('h', -parent.getStyle('margin-left'))
      pathData.push('v', leftY - Math.sign(leftY) * 10)
      pathData.push('C', leftX, pi.y, leftX, pi.y, leftX - 10, pi.y)
      pathData.push('H', pi.x)
      break

    case abs(v.x) > abs(v.y) && v.x >= 0:
      // right
      var rightX = po.x + parent.getStyle('margin-right')
      var rightY = pi.y - po.y
      pathData.push('h', parent.getStyle('margin-right'))
      pathData.push('v', rightY - Math.sign(rightY) * 10)
      pathData.push('C', rightX, pi.y, rightX, pi.y, rightX + 10, pi.y)
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
