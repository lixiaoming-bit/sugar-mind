/**
 * KityMinder 类，暴露在 window 上的唯一变量
 */
import utils from './utils'
const kity = window.kity

const _initHooks = []

const Minder = kity.createClass('Minder', {
  constructor: function (options) {
    this._options = utils.extend({}, options)

    const initHooks = _initHooks.slice()

    let initHook
    while (initHooks.length) {
      initHook = initHooks.shift()
      if (typeof initHook == 'function') {
        initHook.call(this, this._options)
      }
    }

    this.fire('finishInitHook')
  }
})

Minder.version = '1.4.43'

Minder.registerInitHook = function (hook) {
  _initHooks.push(hook)
}

export default Minder
