/**
 * 支持各种调试后门
 */
import format from './format'

const stringHash = str => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }
  return hash
}

export default function debug(flag) {
  const debugMode = (this.isFlag = window.location.search.indexOf(flag) !== -1)

  if (debugMode) {
    const h = stringHash(flag) % 360

    const flagStyle = format(
      'background: hsl({0}, 50%, 80%); ' +
        'color: hsl({0}, 100%, 30%); ' +
        'padding: 2px 3px; ' +
        'margin: 1px 3px 0 0;' +
        'border-radius: 6px;',
      h
    )

    const textStyle = 'background: none; color: black;'
    this.log = function () {
      const output = format.apply(null, arguments)
      console.log(format('%c{0}%c{1}', flag, output), flagStyle, textStyle)
    }
  } else {
    this.log = function () {}
  }
}
