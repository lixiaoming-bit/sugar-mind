const kity = window.kity
const uuidMap = {}
const utils = {}
utils.extend = kity.Utils.extend.bind(kity.Utils)
utils.each = kity.Utils.each.bind(kity.Utils)

utils.uuid = function (group) {
  uuidMap[group] = uuidMap[group] ? uuidMap[group] + 1 : 1
  return group + uuidMap[group]
}

utils.guid = function () {
  return (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36)
}

utils.trim = function (str) {
  return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '')
}

utils.keys = function (plain) {
  const keys = []
  for (const key in plain) {
    if (Object.hasOwnProperty.call(plain, key)) {
      keys.push(key)
    }
  }
  return keys
}

utils.clone = function (source) {
  return JSON.parse(JSON.stringify(source))
}

utils.comparePlainObject = function (a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

utils.encodeHtml = function (str, reg) {
  return str
    ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp);)?/g, function (a, b) {
        if (b) {
          return a
        } else {
          return {
            '<': '&lt;',
            '&': '&amp;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
          }[a]
        }
      })
    : ''
}

utils.clearWhiteSpace = function (str) {
  return str.replace(/[\u200b\t\r\n]/g, '')
}

utils.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object'], function (v) {
  utils['is' + v] = function (obj) {
    return Object.prototype.toString.apply(obj) === '[object ' + v + ']'
  }
})
utils.getTextBoundary = (text, style) => {
  if (!text) return { width: 0, height: 0 }
  text = text.replaceAll('<', '-')
  text = text.replaceAll('>', '-')
  text = text.replaceAll('\n', '<br/>')
  let element = document.querySelector('#check')
  if (!element) {
    element = document.createElement('span')
    element.setAttribute('id', 'check')
    element.style.visibility = 'hidden'
    element.style.position = 'absolute'
    element.style.opacity = '0'
    element.style.maxWidth = '400px'
    element.style.wordWrap = 'break-word'
    document.querySelector('#app').appendChild(element)
  }
  element.style.fontSize = style.fontSize || ''
  element.style.fontFamily = style.fontFamily || '微软雅黑, "Microsoft YaHei"'
  element.innerHTML = text
  const box = { width: element.offsetWidth, height: element.offsetHeight }
  const tempWidth = Math.round(box.width)
  const tempHeight = Math.round(box.height)
  // 使文本宽高都是偶数 方便各种布局的计算
  box.width = tempWidth % 2 ? tempWidth + 1 : tempWidth
  box.height = tempHeight % 2 ? tempHeight + 1 : tempHeight
  return box
}

utils.styleToString = style => {
  let s = []
  for (const key in style) {
    if (Object.hasOwnProperty.call(style, key)) {
      const element = style[key]
      if (element) {
        const head = key.replace(/([a-zA-Z])([A-Z])/g, '$1-$2').toLowerCase()
        s.push(head + ':' + element)
      }
    }
  }
  s = s.join(';')
  return s
}

// 计算两个直线是否相交 [a,b] [c,d]
utils.calculateCrossPoint = (a, b, c, d) => {
  // 平⾏或共线, 不相交
  const denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y)
  if (!denominator) new kity.Point()
  const x =
    ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) +
      (b.y - a.y) * (d.x - c.x) * a.x -
      (d.y - c.y) * (b.x - a.x) * c.x) /
    denominator
  const y =
    -(
      (b.y - a.y) * (d.y - c.y) * (c.x - a.x) +
      (b.x - a.x) * (d.y - c.y) * a.y -
      (d.x - c.x) * (b.y - a.y) * c.y
    ) / denominator
  /** 2 判断交点是否在两条线段上 **/
  if (
    // 交点在线段1上
    (x - a.x) * (x - b.x) <= 0 &&
    (y - a.y) * (y - b.y) <= 0 &&
    // 且交点也在线段2上
    (x - c.x) * (x - d.x) <= 0 &&
    (y - c.y) * (y - d.y) <= 0
  ) {
    // 返回交点p
    return new kity.Point(x, y)
  }
  return new kity.Point()
}

// 计算p点在p1点与p2点线段之间位置
utils.calculatePointPosition = (p, p1, p2) => {
  const position = ((p1.x - p2.x) / (p1.y - p2.y)) * (p.y - p2.y) + p2.x
  //线的左边，说明点在，小于在右边，等于则在线上。
  if (position > p.x) {
    return 'left'
  }
  // 线的右边
  else if (position < p.x) {
    return 'right'
  }
  // 线上
  return 'inner'
}

export default utils
