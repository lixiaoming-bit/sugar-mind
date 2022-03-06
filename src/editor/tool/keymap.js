const keymap = {
  shift: 16,
  Control: 17,
  Alt: 18,
  CapsLock: 20,

  backspace: 8,
  tab: 9,
  enter: 13,
  Esc: 27,
  Space: 32,

  PageUp: 33,
  PageDown: 34,
  End: 35,
  Home: 36,

  ins: 45,

  Left: 37,
  up: 38,
  Right: 39,
  down: 40,

  Direction: {
    37: 1,
    38: 1,
    39: 1,
    40: 1
  },

  del: 46,

  NumLock: 144,

  Cmd: 91,
  CmdFF: 224,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,

  '`': 192,
  '=': 187,
  '-': 189,

  '/': 191,
  '.': 190
}

// 小写适配
for (const key in keymap) {
  if (Object.hasOwnProperty.call(keymap, key)) {
    keymap[key.toLowerCase()] = keymap[key]
  }
}
const aKeyCode = 65
const aCharCode = 'a'.charCodeAt(0)

// letters
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
  keymap[letter] = aKeyCode + (letter.charCodeAt(0) - aCharCode)
})

// numbers
let n = 9
do {
  keymap[n.toString()] = n + 48
} while (--n)

export default keymap
