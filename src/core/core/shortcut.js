/**
 * 添加快捷键支持
 */
import utils from './utils'
import Minder from './minder'
import MinderEvent from './event'
import keymap from './keymap'
const kity = window.kity

/**
 * 计算包含 meta 键的 keycode
 *
 * @param  {String|KeyEvent} unknown
 */
function getMetaKeyCode(unknown) {
  const CTRL_MASK = 0x1000
  const ALT_MASK = 0x2000
  const SHIFT_MASK = 0x4000
  let metaKeyCode = 0

  if (typeof unknown === 'string') {
    // unknown as string
    unknown
      .toLowerCase()
      .split(/\+\s*/)
      .forEach(function (name) {
        switch (name) {
          case 'ctrl':
          case 'cmd':
            metaKeyCode |= CTRL_MASK
            break
          case 'alt':
            metaKeyCode |= ALT_MASK
            break
          case 'shift':
            metaKeyCode |= SHIFT_MASK
            break
          default:
            metaKeyCode |= keymap[name]
        }
      })
  } else {
    // unknown as key event
    if (unknown.ctrlKey || unknown.metaKey) {
      metaKeyCode |= CTRL_MASK
    }
    if (unknown.altKey) {
      metaKeyCode |= ALT_MASK
    }
    if (unknown.shiftKey) {
      metaKeyCode |= SHIFT_MASK
    }
    metaKeyCode |= unknown.keyCode
  }

  return metaKeyCode
}
kity.extendClass(MinderEvent, {
  isShortcutKey(keyCombine) {
    const keyEvent = this.originEvent
    if (!keyEvent) return false

    return getMetaKeyCode(keyCombine) === getMetaKeyCode(keyEvent)
  }
})

Minder.registerInitHook(function () {
  this._initShortcutKey()
})

kity.extendClass(Minder, {
  _initShortcutKey() {
    this._shortcutKeys = {}
  },

  // _bindShortcutKeys() {
  // const map = ()
  // this.on('keydown', function (e) {
  //   console.log('map: ', map)
  //   for (const keys in map) {
  //     if (!Object.hasOwnProperty.call(map, keys)) continue
  //     if (e.isShortcutKey(keys)) {
  //       const fn = map[keys]
  //       if (fn.__statusCondition && fn.__statusCondition !== this.getStatus()) return
  //       fn()
  //       e.preventDefault()
  //     }
  //   }
  // })
  // },

  addShortcut(keys, fn) {
    const binds = this._shortcutKeys
    keys.split(/\|\s*/).forEach(function (combine) {
      const parts = combine.split('::')
      let status
      if (parts.length > 1) {
        combine = parts[1]
        status = parts[0]
        fn.__statusCondition = status
      }
      if (!combine) return
      binds[combine] = fn
    })
  },
  getShortcutKeys() {
    return this._shortcutKeys
  },

  addCommandShortcutKeys(cmd, keys) {
    const binds = this._commandShortcutKeys || (this._commandShortcutKeys = {})
    let obj = {}
    if (keys) {
      obj[cmd] = keys
    } else {
      obj = cmd
    }

    const minder = this

    utils.each(obj, function (keys, command) {
      binds[command] = keys

      minder.addShortcut(keys, function execCommandByShortcut(e) {
        // 之前判断有问题，由 === 0 改为 !== -1
        if (minder.queryCommandState(command) !== -1) {
          const condition = [49, 50, 51, 52, 53, 54, 37, 38, 39, 40]
          condition.includes(e.keyCode)
            ? minder.execCommand(command, e.keyCode)
            : minder.execCommand(command)
        }
      })
    })
  },

  getCommandShortcutKey(cmd) {
    const binds = this._commandShortcutKeys
    return (binds && binds[cmd]) || null
  },

  // 添加一个判断是否支持原生Clipboard的变量，用于对ctrl + v和ctrl + c的处理
  supportClipboardEvent: (function (window) {
    return !!window.ClipboardEvent
  })(window)
})
