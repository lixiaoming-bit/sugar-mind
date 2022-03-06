const keymap = {
  backspace: 8,
  tab: 9,
  enter: 13,

  shift: 16,
  Control: 17,
  Alt: 18,
  CapsLock: 20,

  Esc: 27,

  Spacebar: 32,

  PageUp: 33,
  PageDown: 34,
  End: 35,
  Home: 36,

  ins: 45,

  left: 37,
  up: 38,
  right: 39,
  down: 40,

  direction: {
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
  '.': 190,
  controlKeys: {
    16: 1,
    17: 1,
    18: 1,
    20: 1,
    91: 1,
    224: 1
  },
  notContentChange: {
    13: 1,
    9: 1,

    33: 1,
    34: 1,
    35: 1,
    36: 1,

    16: 1,
    17: 1,
    18: 1,
    20: 1,
    91: 1,

    //上下左右
    37: 1,
    38: 1,
    39: 1,
    40: 1,

    113: 1,
    114: 1,
    115: 1,
    144: 1,
    27: 1
  },

  isSelectedNodeKey: {
    //上下左右
    37: 1,
    38: 1,
    39: 1,
    40: 1,
    13: 1,
    9: 1
  }
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
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (letter) {
  keymap[letter] = aKeyCode + (letter.charCodeAt(0) - aCharCode)
})

// numbers
let n = 9
do {
  keymap[n.toString()] = n + 48
} while (--n)

export default keymap
