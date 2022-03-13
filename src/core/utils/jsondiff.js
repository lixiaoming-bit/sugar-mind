// 用于diff 数据

const objectKeys = (() => {
  if (Object.keys) return Object.keys
  return o => {
    const keys = []
    for (const i in o) {
      if (Object.hasOwnProperty.call(o, i)) {
        keys.push(i)
      }
    }
    return keys
  }
})()
const escapePathComponent = str =>
  str.indexOf('/') === -1 && str.indexOf('~') === -1
    ? str
    : str.replace(/~/g, '~0').replace(/\//g, '~1')

const deepClone = obj => (typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj)

// Dirty check if obj is different from mirror, generate patches and update mirror
const generate = (mirror, obj, patches, path) => {
  const newKeys = objectKeys(obj)
  const oldKeys = objectKeys(mirror)
  let deleted = false

  for (let t = oldKeys.length - 1; t >= 0; t--) {
    const key = oldKeys[t]
    const oldVal = mirror[key]
    if (Object.hasOwnProperty.call(obj, key)) {
      const newVal = obj[key]
      if (
        typeof oldVal === 'object' &&
        oldVal !== null &&
        typeof newVal === 'object' &&
        newVal !== null
      ) {
        generate(oldVal, newVal, patches, path + '/' + escapePathComponent(key))
      } else {
        if (oldVal != newVal) {
          patches.push({
            op: 'replace',
            path: path + '/' + escapePathComponent(key),
            value: deepClone(newVal)
          })
        }
      }
    } else {
      patches.push({ op: 'remove', path: path + '/' + escapePathComponent(key) })
      deleted = true // property has been deleted
    }
  }

  if (!deleted && newKeys.length === oldKeys.length) {
    return
  }
  for (let t = 0; t < newKeys.length; t++) {
    const key = newKeys[t]
    if (!Object.hasOwnProperty.call(mirror, key)) {
      patches.push({
        op: 'add',
        path: path + '/' + escapePathComponent(key),
        value: deepClone(obj[key])
      })
    }
  }
}

export default function compare(tree1, tree2) {
  const patches = []
  generate(tree1, tree2, patches, '')
  return patches
}
