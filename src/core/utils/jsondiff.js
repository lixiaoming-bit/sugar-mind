// 用于diff 数据

const escapePathComponent = str =>
  str.indexOf('/') === -1 && str.indexOf('~') === -1
    ? str
    : str.replace(/~/g, '~0').replace(/\//g, '~1')

const deepClone = obj => (typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj)

// Dirty check if obj is different from mirror, generate patches and update mirror
const generate = (mirror, obj, patches, path) => {
  const newKeys = Object.keys(obj)
  const oldKeys = Object.keys(mirror)
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
        if (oldVal !== newVal) {
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

const includeRelationshipData = patch => {
  if (Array.isArray(patch)) {
    return patch.some(item => item.path.indexOf('sp') !== -1)
  }
  return false
}

export default function compare(tree1, tree2) {
  const patches = []
  generate(tree1, tree2, patches, '')
  // patches.forEach(patch => {
  //   if (patch.path.inde)
  // })
  const target = patches.filter(patch => !includeRelationshipData(patch))
  console.log('patches: ', target)
  return patches
}
