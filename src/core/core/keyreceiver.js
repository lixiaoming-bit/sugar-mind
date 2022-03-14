import Minder from './minder'
const Mousetrap = require('mousetrap')
const kity = window.kity

Minder.registerInitHook(function () {
  this.setDefaultOptions({
    enableKeyReceiver: true
  })
  if (this.getOption('enableKeyReceiver')) {
    this.on('paperrender', function () {
      this._initKeyReceiver()
    })
  }
})

kity.extendClass(Minder, {
  _initKeyReceiver: function () {
    const shortcutKeys = this.getShortcutKeys()
    console.log('shortcutKeys: ', shortcutKeys)
    for (const key in shortcutKeys) {
      if (Object.hasOwnProperty.call(shortcutKeys, key)) {
        const fn = shortcutKeys[key]
        Mousetrap.bind([key], e => {
          fn(e)
          e.preventDefault()
          e.stopPropagation()
        })
      }
    }
  }
})
