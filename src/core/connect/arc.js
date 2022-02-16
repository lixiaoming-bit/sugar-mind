/**
 *
 * 圆弧连线
 *
 */
import connect from '../core/connect'
const kity = window.kity

// const connectMarker = new kity.Marker().pipe(function () {
//   const r = 7
//   const dot = new kity.Circle(r - 1)
//   this.addShape(dot)
//   this.setRef(r - 1, 0)
//     .setViewBox(-r + 2, -r + 2, r + r, r + r)
//     .setWidth(r)
//     .setHeight(r)
//   this.dot = dot
//   this.node.setAttribute('markerUnits', 'userSpaceOnUse')
// })

connect.register('arc', function (node, parent, connection) {
  const box = node.getLayoutBox()
  const pBox = parent.getLayoutBox()

  const pathData = []
  const abs = Math.abs
  const side = box.x > pBox.x ? 'right' : 'left'

  // node.getMinder().getPaper().addResource(connectMarker)

  const start = new kity.Point(pBox.cx, pBox.cy)
  const end = side === 'left' ? new kity.Point(box.right, box.cy) : new kity.Point(box.left, box.cy)

  const vector = kity.Vector.fromPoints(start, end)
  pathData.push('M', start)
  pathData.push('A', abs(vector.x), abs(vector.y), 0, 0, vector.x * vector.y > 0 ? 0 : 1, end)

  connection.setPathData(pathData)
})
