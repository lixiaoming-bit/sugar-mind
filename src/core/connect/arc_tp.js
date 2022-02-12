/**
 * 圆弧连线
 */
import connect from '../core/connect'
const kity = window.kity

const connectMarker = new kity.Marker().pipe(function () {
  const r = 7
  const dot = new kity.Circle(r - 1)
  this.addShape(dot)
  this.setRef(r - 1, 0)
    .setViewBox(-r, -r, r + r, r + r)
    .setWidth(r)
    .setHeight(r)
  this.dot = dot
  this.node.setAttribute('markerUnits', 'userSpaceOnUse')
})

/**
 * 天盘图连线除了连接当前节点和前一个节点外, 还需要渲染当前节点和后一个节点的连接, 防止样式上的断线
 * 这是天盘图与其余的模板不同的地方
 */
connect.register('arc_tp', function (node, parent, connection, width, color) {
  const end_box = node.getLayoutBox()
  let start_box = parent.getLayoutBox()

  const index = node.getIndex()
  const nextNode = parent.getChildren()[index + 1]

  if (node.getIndex() > 0) {
    start_box = parent.getChildren()[index - 1].getLayoutBox()
  }

  let start
  let end
  // let vector
  let pathData = []

  node.getMinder().getPaper().addResource(connectMarker)

  start = new kity.Point(start_box.cx, start_box.cy)
  end = new kity.Point(end_box.cx, end_box.cy)

  let jl = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)) //两圆中心点距离

  jl = node.getIndex() === 0 ? jl * 0.4 : jl

  // vector = kity.Vector.fromPoints(start, end)
  pathData.push('M', start)
  pathData.push('A', jl, jl, 0, 0, 1, end)

  connection.setMarker(connectMarker)
  connectMarker.dot.fill(color)
  connection.setPathData(pathData)

  // 设置下一个的节点的连接线
  if (nextNode && nextNode.getConnection()) {
    let nextConnection = nextNode.getConnection()
    const next_end_box = nextNode.getLayoutBox()
    const next_end = new kity.Point(next_end_box.cx, next_end_box.cy)

    const jl2 = Math.sqrt(Math.pow(end.x - next_end.x, 2) + Math.pow(end.y - next_end.y, 2)) //两圆中心点距离

    pathData = []

    pathData.push('M', end)
    pathData.push('A', jl2, jl2, 0, 0, 1, next_end)

    nextConnection.setMarker(connectMarker)
    connectMarker.dot.fill(color)

    nextConnection.setPathData(pathData)
  }
})
