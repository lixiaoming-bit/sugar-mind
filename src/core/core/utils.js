const kity = require('./kity')
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
export default utils
