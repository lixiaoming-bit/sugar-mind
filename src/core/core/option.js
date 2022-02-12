/**
 * 提供脑图选项支持
 */
import utils from './utils'
import Minder from './minder'
const kity = window.kity

Minder.registerInitHook(function () {
  this._defaultOptions = {}
})

kity.extendClass(Minder, {
  setDefaultOptions: function (options) {
    utils.extend(this._defaultOptions, options)
    return this
  },
  getOption: function (key) {
    if (key) {
      return key in this._options ? this._options[key] : this._defaultOptions[key]
    } else {
      return utils.extend({}, this._defaultOptions, this._options)
    }
  },
  setOption: function (key, value) {
    this._options[key] = value
  }
})
