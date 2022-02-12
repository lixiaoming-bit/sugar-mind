/**
 * 鱼骨头主干连线
 */
import connect from '../core/connect'

connect.register('fish-bone-master', function (node, parent, connection) {
  const pout = parent.getLayoutVertexOut()
  const pin = node.getLayoutVertexIn()

  const abs = Math.abs

  const dy = abs(pout.y - pin.y)
  const dx = abs(pout.x - pin.x)

  const pathData = []

  pathData.push('M', pout.x, pout.y)
  pathData.push('h', dx - dy)
  pathData.push('L', pin.x, pin.y)

  connection.setMarker(null)
  connection.setPathData(pathData)
})
