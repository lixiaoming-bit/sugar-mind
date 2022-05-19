/**
 *
 * 圆弧连线，概要连线
 *
 */
import connect from '../core/connect'

connect.register('arc_sum', function (node, parent, connection) {
  const box = node.getLayoutBox()
  const aBox = node.getSummaryBox(node)
  const pBox = node.parent.getGlobalLayoutTransform().transformBox(aBox)
  const pathData = []
  // right:矩形区域的最右侧坐标，等价于 x + width 的值
  // left:矩形区域的最左侧坐标，等价于 x 的值
  if (box.x > pBox.x) {
    // 在右边
    pathData.push('M', pBox.right, pBox.top)
    pathData.push('Q', box.left, box.cy, pBox.right, pBox.bottom)
    pathData.push('M', pBox.right + (box.left - pBox.right) / 2, box.cy)
    pathData.push('L', box.left, box.cy)
  } else {
    // 在左边
    pathData.push('M', pBox.left, pBox.top)
    pathData.push('Q', box.right, box.cy, pBox.left, pBox.bottom)
    pathData.push('M', pBox.left + (box.right - pBox.left) / 2, box.cy)
    pathData.push('L', box.right, box.cy)
  }
  connection.setPathData(pathData)
})
