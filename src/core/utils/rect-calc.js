/**
 * box 相对于页面的绝对坐标
    bottom: 315.5
    cx: 1008.5
    cy: 279.5
    height: 72
    left: 933.5
    right: 1083.5
    top: 243.5
    width: 150
    x: 933.5
    y: 243.5
 */
const kity = window.kity
export const getRectDirection = (start, end, pathData) => {
  const { round: r, abs } = Math
  const offset = 100
  const startBox = start.getLayoutBox()
  const endBox = end.getLayoutBox()

  const deltaX = abs(startBox.left - endBox.left)
  const deltaY = abs(startBox.top - endBox.top)
  // const isHor = deltaX <= 100
  // const isVer = deltaY <= 100

  const isSameDirection = deltaX * deltaY <= 10000

  // start end 同向
  if (isSameDirection) {
    // 水平方向同向
    if (deltaX <= deltaY) {
      const dir = abs(startBox.x) > abs(startBox.y) && startBox.x >= 0 ? 'right' : 'left'
      const sign = dir === 'left' ? -1 : 1

      const po = new kity.Point(startBox[dir], startBox.cy)
      const pi = new kity.Point(endBox[dir], endBox.cy)

      pathData.push('M', r(po.x), r(po.y))
      pathData.push('C', po.x + sign * offset, po.y, pi.x + sign * offset, pi.y, pi.x, pi.y)
    }
    // 竖直方向同向
    else {
      const dir = abs(startBox.x) <= abs(startBox.y) && startBox.y >= 0 ? 'bottom' : 'top'
      const sign = dir === 'top' ? -1 : 1
      const po = new kity.Point(startBox.cx, startBox[dir])
      const pi = new kity.Point(endBox.cx, endBox[dir])

      pathData.push('M', r(po.x), r(po.y))
      pathData.push('C', po.x, po.y + sign * offset, pi.x, pi.y + sign * offset, pi.x, pi.y)
    }
  }
  // start end 内部连接
  else {
    let po, pi
    // 水平方向上 start 在 end的左侧
    if (startBox.left <= endBox.left) {
      po = new kity.Point(startBox['right'], startBox.cy)
      pi = new kity.Point(endBox['left'], endBox.cy)
    }
    // 右侧
    else {
      po = new kity.Point(startBox['left'], startBox.cy)
      pi = new kity.Point(endBox['right'], endBox.cy)
    }

    // 竖直方向上 start 在 end的上侧
    if (startBox.top <= endBox.top) {
      po.offset(0, abs(startBox.cy))
      pi.offset(0, -abs(endBox.cy))
    }
    // 下侧
    else {
      po.offset(0, -abs(startBox.cy))
      pi.offset(0, abs(endBox.cy))
    }
  }

  // if (dir === 'left' || dir === 'right') {
  //   const po = start.getLayoutPoint(new kity.Point(startBox[dir], startBox.cy))
  //   const pi = end.getLayoutPoint(new kity.Point(endBox[dir], endBox.cy))
  //   return [po, pi]
  // }
  // if (dir === 'top' || dir === 'bottom') {
  //   const po = start.getLayoutPoint(new kity.Point(startBox.cx, startBox[dir]))
  //   const pi = end.getLayoutPoint(new kity.Point(endBox.cx, endBox[dir]))
  //   return [po, pi]
  // }
}
/**
 * 矩形的包含判断
 * @param outRect box   包含者
 * @param innerRect box   被包含者
 * @returns : boolean   表示包含者是否包含被包含者
 *
 * # 注意
 * 包含及相等都属于包含
 */
export const rectIsContain = (outRect, innerRect) => {
  const left = outRect.x <= innerRect.x
  const right = outRect.width >= innerRect.width
  const top = outRect.y <= innerRect.y
  const bottom = outRect.height <= innerRect.height

  return left && right && top && bottom
}

/**
 * 矩形的相交或包含判断
 * @param rect1 box   矩形1
 * @param rect2 box   矩形2
 * @returns : boolean   表示矩形1与矩形2是否相交或包含
 *
 * 注意
 * 不包含相切
 */
export const rectIsCrossOrContain = (rect1, rect2) => {
  const { max, min } = Math

  const maxLeft = max(rect1.left, rect2.left)
  const maxTop = max(rect1.top, rect2.top)
  const minRight = min(rect1.right, rect2.right)
  const minBottom = min(rect1.bottom, rect2.bottom)

  const horCross = maxLeft < minRight
  const verCross = maxTop < minBottom

  return horCross && verCross
}

/**
 * 矩形水平方向上的相交或包含判断
 * @param rect1 box   矩形1
 * @param rect2 box   矩形2
 * @returns : boolean   表示矩形1与矩形2在水平方向上是否相交或包含
 *
 * 注意
 * 不包含相切
 */
export const rectIsCrossOrContainOnHor = (rect1, rect2) => {
  const { left: left1, right: right1 } = rect1
  const { left: left2, right: right2 } = rect2

  const maxLeft = Math.max(left1, left2)
  const minRight = Math.min(right1, right2)

  return maxLeft < minRight
}

/**
 * 矩形垂直方向上的相交或包含判断
 * @param rect1 box   矩形1
 * @param rect2 box   矩形2
 * @returns : boolean   表示矩形1与矩形2在垂直方向上是否相交或包含
 *
 * 注意
 * 不包含相切
 */
export const rectIsCrossOrContainOnVer = (rect1, rect2) => {
  const maxTop = Math.max(rect1.top, rect2.top)
  const minBottom = Math.min(rect1.bottom, rect2.bottom)

  return maxTop < minBottom
}

/**
 * 判断在水平方向上 rect1 是否在 rect2 的前面，且不相交
 * @param rect1 box   前面的矩形
 * @param rect2 box   后面的矩形
 * @returns : boolean   表示在水平方向上 rect1 是否在 rect2 的前面，且不相交；
 *
 * 注意
 * 包含相切
 */
export const rectIsInFrontOnHor = (rect1, rect2) => {
  return rect1.right <= rect2.left
}

/**
 * 判断在垂直方向上 rect1 是否在 rect2 的前面，且不相交
 * @param rect1 box   前面的矩形
 * @param rect2 box   后面的矩形
 * @returns : boolean   表示在垂直方向上 rect1 是否在 rect2 的前面，且不相交；
 *
 * 注意
 * 包含相切
 */
export const rectIsInFrontOnVer = (rect1, rect2) => {
  return rect1.bottom <= rect2.bottom
}

/**
 * 矩形的相交判断
 * @param rect1 box   矩形1
 * @param rect2 box   矩形2
 * @returns : boolean   表示矩形1与矩形2是否相交
 *
 * # 注意
 * 包含不属于相交
 */
export const rectIsCross = (rect1, rect2) => {
  const crossOrContain = rectIsCrossOrContain(rect1, rect2)
  const contain2 = rectIsContain(rect1, rect2)
  const contain1 = rectIsContain(rect2, rect1)

  return crossOrContain && !contain2 && !contain1
}

/**
 * 矩形的相切
 * @param rect1 box   矩形1
 * @param rect2 box   矩形2
 * @returns : boolean   表示矩形1与矩形2是否相切
 *
 */
export const rectIstTangent = (rect1, rect2) => {
  const isCrossOrContain = rectIsCrossOrContain(rect1, rect2)

  //判断单边是否相切
  const rt1L = rect1.right === rect2.left
  const rt1R = rect1.left === rect2.right
  const rt1T = rect1.bottom === rect2.top
  const rt1B = rect1.top === rect2.bottom

  //判断是否有相切的边
  const haveTangent = rt1L || rt1R || rt1T || rt1B

  return !isCrossOrContain && haveTangent
}

/**
 * 判断点是否在矩形内
 * @param point :{x:number,y:number}   点
 * @param rect box   矩形
 * @returns : boolean
 *
 * # 注意
 * 不包含 点 在 矩形边上的情况
 */
export const pointInRect = (point, rect) => {
  const pL = rect.left < point.x
  const pR = point.x < rect.right
  const pT = rect.top < point.y
  const pB = point.y < rect.bottom

  return pL && pR && pT && pB
}

/**
 * 判断点是否在矩形上
 * @param point :{x:number,y:number}   点
 * @param rect box   矩形
 * @returns : boolean
 *
 * # 注意
 * 包含 点 在 矩形边上的情况
 */
export const pointOnRect = (point, rect) => {
  const pL = rect.left <= point.x
  const pR = point.x <= rect.right
  const pT = rect.top <= point.y
  const pB = point.y <= rect.bottom

  return pL && pR && pT && pB
}

/**
 * 判断点是否在矩形的边框上
 * @param point :{x:number,y:number}   点
 * @param rect box   矩形
 * @returns : boolean   表示是否在矩形的边框上
 *
 */
export const pointOnRectBorder = (point, rect) => {
  const onRect = pointOnRect(point, rect)
  const inRect = pointInRect(point, rect)

  return !inRect && onRect
}
